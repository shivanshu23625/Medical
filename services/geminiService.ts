import { GoogleGenAI, FunctionDeclaration, Type, Tool } from "@google/genai";
import { MOCK_DOCTORS, MOCK_AMBULANCES } from "../constants";

// Tool Definitions
const findDoctorsTool: FunctionDeclaration = {
  name: 'findDoctors',
  description: 'Find doctors based on department or general query.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      department: { type: Type.STRING, description: 'The medical department (e.g., Cardiology, Pediatrics)' },
    },
  },
};

const findAmbulancesTool: FunctionDeclaration = {
  name: 'findAmbulances',
  description: 'Find available ambulances near the user location.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      type: { type: Type.STRING, description: 'Type of ambulance (Basic, ICU, etc.)' },
    },
  },
};

const bookAppointmentTool: FunctionDeclaration = {
  name: 'bookAppointment',
  description: 'Book an appointment with a specific doctor.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      doctorName: { type: Type.STRING, description: 'Name of the doctor' },
      date: { type: Type.STRING, description: 'Date of the appointment (YYYY-MM-DD)' },
      time: { type: Type.STRING, description: 'Time of the appointment' },
      patientName: { type: Type.STRING, description: 'Name of the patient' },
      reason: { type: Type.STRING, description: 'Reason for visit' }
    },
    required: ['doctorName', 'date', 'time', 'patientName']
  },
};

const dispatchAmbulanceTool: FunctionDeclaration = {
  name: 'dispatchAmbulance',
  description: 'Dispatch an emergency ambulance to a location.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      location: { type: Type.STRING, description: 'Pickup location' },
      hospital: { type: Type.STRING, description: 'Preferred hospital name (optional)' }
    },
    required: ['location']
  },
};

const tools: Tool[] = [{
  functionDeclarations: [findDoctorsTool, findAmbulancesTool, bookAppointmentTool, dispatchAmbulanceTool]
}];

// Service Class
export class GeminiService {
  private ai: GoogleGenAI;
  private model: any;
  private chatSession: any;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    this.model = 'gemini-2.5-flash';
    this.chatSession = this.ai.chats.create({
      model: this.model,
      config: {
        systemInstruction: `You are VitalLink, an intelligent medical assistant in India. 
        Your capabilities:
        1. Recommend doctors based on high ratings and specific departments.
        2. Help users find and book ambulances (Basic, ICU, etc.).
        3. Handle emergencies by dispatching ambulances immediately using the tool.
        4. Book appointments by collecting patient details (Name, Date, Time).
        
        Important:
        - All fees are in INR (₹).
        - Assume the user is in India unless specified otherwise.
        
        Keep responses concise, empathetic, and helpful. Use emojis where appropriate.
        If a user asks for doctors, CALL the findDoctors tool.
        If a user wants to book an appointment and provides details, CALL the bookAppointment tool.
        If a user implies an IMMEDIATE emergency (like "heart attack", "accident"), CALL the dispatchAmbulance tool immediately.
        `,
        tools: tools,
      }
    });
  }

  async sendMessage(
    message: string, 
    actions: { 
      onFindDoctors: (dept?: string) => void, 
      onFindAmbulances: () => void,
      onBookAppointment: (data: { doctorName: string, date: string, time: string, patientName: string }) => void,
      onDispatchAmbulance: (loc: string, hospital?: string) => void 
    }
  ): Promise<string> {
    try {
      const result = await this.chatSession.sendMessage({ message });
      
      // Handle Tool Calls
      const functionCalls = result.functionCalls;
      
      if (functionCalls && functionCalls.length > 0) {
        // Construct the parts for the tool response
        const parts = [];

        for (const call of functionCalls) {
          const { name, args, id } = call;
          let responseResult = {};

          if (name === 'findDoctors') {
            actions.onFindDoctors(args.department as string);
            responseResult = { result: `Found ${MOCK_DOCTORS.length} doctors available. Displaying list to user.` };
          } else if (name === 'findAmbulances') {
            actions.onFindAmbulances();
            responseResult = { result: `Found ${MOCK_AMBULANCES.length} ambulances nearby. Displaying options.` };
          } else if (name === 'bookAppointment') {
            actions.onBookAppointment({
              doctorName: args.doctorName as string,
              date: args.date as string,
              time: args.time as string,
              patientName: args.patientName as string
            });
            responseResult = { result: `Appointment booked with ${args.doctorName} for ${args.date} at ${args.time}.` };
          } else if (name === 'dispatchAmbulance') {
            actions.onDispatchAmbulance(args.location as string, args.hospital as string);
            responseResult = { result: `Ambulance dispatched to ${args.location}. Calculating rush-free route...` };
          }

          parts.push({
            functionResponse: {
              name: name,
              response: responseResult,
              id: id
            }
          });
        }

        const toolResult = await this.chatSession.sendMessage(parts);
        return toolResult.text;
      }

      return result.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "I apologize, but I'm having trouble connecting to the medical network right now. Please try again.";
    }
  }
}

export const geminiService = new GeminiService();