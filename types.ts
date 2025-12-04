export interface Doctor {
  id: string;
  name: string;
  department: string;
  rating: number;
  experience: number;
  image: string;
  available: boolean;
  nextSlot: string;
  fees: number;
  location: string;
  timings: string;
  coordinates?: { lat: number; lng: number };
  distance?: number;
  isBestMatch?: boolean;
}

export interface Ambulance {
  id: string;
  provider: string;
  type: 'Basic Life Support' | 'Advanced Life Support' | 'ICU Express';
  rating: number;
  eta: string;
  fees: number;
  features: string[];
  image: string;
  coordinates?: { lat: number; lng: number };
  distance?: number;
}

export interface RouteStep {
  instruction: string;
  distance: string;
  duration: string;
  trafficStatus: 'clear' | 'moderate' | 'heavy';
}

export interface Appointment {
  id: string;
  doctorName: string;
  department?: string;
  date: string;
  time: string;
  patientName: string;
  status: 'confirmed' | 'cancelled';
  fees?: number;
}

export enum ViewState {
  HOME = 'HOME',
  DOCTORS = 'DOCTORS',
  AMBULANCE_SELECTION = 'AMBULANCE_SELECTION',
  AMBULANCE_TRACKING = 'AMBULANCE_TRACKING',
  BOOKING_FORM = 'BOOKING_FORM',
  BOOKING_SUCCESS = 'BOOKING_SUCCESS',
  MY_APPOINTMENTS = 'MY_APPOINTMENTS'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface AmbulanceRequest {
  active: boolean;
  status: 'searching' | 'dispatched' | 'en_route' | 'arrived';
  eta: string;
  hospital: string;
  route: RouteStep[];
}