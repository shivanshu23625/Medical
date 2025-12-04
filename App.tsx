import React, { useState, useEffect } from 'react';
import { Activity, UserPlus, Stethoscope, Menu, X, Phone, MapPin, Siren, CalendarCheck } from 'lucide-react';
import { Doctor, Message, ViewState, AmbulanceRequest, Ambulance, Appointment } from './types';
import { MOCK_DOCTORS, MOCK_ROUTE, MOCK_AMBULANCES } from './constants';
import { geminiService } from './services/geminiService';
import ChatInterface from './components/ChatInterface';
import DoctorCard from './components/DoctorCard';
import AmbulanceCard from './components/AmbulanceCard';
import AmbulanceView from './components/AmbulanceView';
import BookingForm from './components/BookingForm';
import AppointmentsList from './components/AppointmentsList';

const App: React.FC = () => {
  // State
  const [viewState, setViewState] = useState<ViewState>(ViewState.HOME);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Data State
  const [doctorsWithLoc, setDoctorsWithLoc] = useState<Doctor[]>(MOCK_DOCTORS);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [ambulancesWithLoc, setAmbulancesWithLoc] = useState<Ambulance[]>(MOCK_AMBULANCES);
  const [appointments, setAppointments] = useState<Appointment[]>([
     { id: '1', doctorName: 'Dr. Sarah Chen', department: 'Cardiology', date: '2025-06-15', time: '10:00 AM', patientName: 'John Doe', status: 'confirmed' }
  ]);
  
  // Selection State
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);
  
  const [ambulanceRequest, setAmbulanceRequest] = useState<AmbulanceRequest>({
    active: false,
    status: 'searching',
    eta: '--',
    hospital: '',
    route: []
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          setUserLocation({ lat: userLat, lng: userLng });
          
          const enrichWithLoc = (items: any[]) => items.map(item => {
            const latOffset = (Math.random() - 0.5) * 0.05; 
            const lngOffset = (Math.random() - 0.5) * 0.05;
            return {
              ...item,
              coordinates: {
                lat: userLat + latOffset,
                lng: userLng + lngOffset
              }
            };
          });

          setDoctorsWithLoc(enrichWithLoc(MOCK_DOCTORS));
          setAmbulancesWithLoc(enrichWithLoc(MOCK_AMBULANCES));
        },
        (error) => {
          console.error("Error getting location:", error);
          setDoctorsWithLoc(MOCK_DOCTORS);
          setAmbulancesWithLoc(MOCK_AMBULANCES);
        }
      );
    }
  }, []);

  // Distance Calculator
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; 
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg: number) => deg * (Math.PI / 180);

  // Process Doctors
  const processDoctors = (department?: string) => {
    let results = [...doctorsWithLoc];
    if (department) {
      const lowerDept = department.toLowerCase();
      results = results.filter(d => d.department.toLowerCase().includes(lowerDept));
    }
    if (userLocation) {
      results = results.map(doc => {
        if (doc.coordinates) {
          const dist = calculateDistance(
            userLocation.lat, userLocation.lng,
            doc.coordinates.lat, doc.coordinates.lng
          );
          return { ...doc, distance: dist };
        }
        return doc;
      }).sort((a, b) => (a.distance || 999) - (b.distance || 999));
    }

    if (results.length > 0) {
        results = results.map(d => ({...d, isBestMatch: false}));
        const topCandidates = results.slice(0, Math.min(results.length, 3));
        const bestMatch = topCandidates.reduce((prev, current) => 
            (current.rating > prev.rating) ? current : prev
        );
        results = results.map(d => 
            d.id === bestMatch.id ? { ...d, isBestMatch: true } : d
        );
    }
    setFilteredDoctors(results);
  };

  const processAmbulances = () => {
    let results = [...ambulancesWithLoc];
    if (userLocation) {
      results = results.map(amb => {
        if (amb.coordinates) {
          const dist = calculateDistance(
            userLocation.lat, userLocation.lng,
            amb.coordinates.lat, amb.coordinates.lng
          );
          return { ...amb, distance: dist };
        }
        return amb;
      }).sort((a, b) => (a.distance || 999) - (b.distance || 999));
    }
    setAmbulancesWithLoc(results);
  };

  // Handlers
  const handleSendMessage = async (text: string) => {
    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const responseText = await geminiService.sendMessage(text, {
        onFindDoctors: (dept) => {
          setViewState(ViewState.DOCTORS);
          processDoctors(dept);
        },
        onFindAmbulances: () => {
          setViewState(ViewState.AMBULANCE_SELECTION);
          processAmbulances();
        },
        onBookAppointment: (data) => {
          // Add to appointments state
          const newAppt: Appointment = {
             id: Date.now().toString(),
             doctorName: data.doctorName,
             department: 'General', // Would come from real data lookup
             date: data.date,
             time: data.time,
             patientName: data.patientName,
             status: 'confirmed'
          };
          setAppointments(prev => [newAppt, ...prev]);
          setViewState(ViewState.BOOKING_SUCCESS);
          setTimeout(() => setViewState(ViewState.MY_APPOINTMENTS), 2500); 
        },
        onDispatchAmbulance: (location, hospital) => {
          setViewState(ViewState.AMBULANCE_TRACKING);
          setAmbulanceRequest({
            active: true,
            status: 'en_route',
            eta: '8 mins',
            hospital: hospital || 'City General Hospital',
            route: MOCK_ROUTE
          });
        }
      });

      const newBotMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
      setMessages(prev => [...prev, newBotMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = { id: Date.now().toString(), role: 'model', text: "I encountered an error. Please try again." };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingClick = (doctor: Doctor) => {
    setSelectedDoctorForBooking(doctor);
    setViewState(ViewState.BOOKING_FORM);
  };

  const handleBookingSubmit = (data: { date: string; time: string; patientName: string; reason: string }) => {
     if (selectedDoctorForBooking) {
       const message = `Book an appointment with ${selectedDoctorForBooking.name} on ${data.date} at ${data.time} for ${data.patientName}. Reason: ${data.reason}`;
       handleSendMessage(message);
     }
  };

  const handleManualAmbulanceBooking = (ambulance: Ambulance) => {
    handleSendMessage(`Dispatch the ${ambulance.type} from ${ambulance.provider} immediately.`);
  };

  const handleEmergency = () => {
    const locString = userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : "my current location";
    handleSendMessage(`EMERGENCY! Dispatch an ambulance to ${locString} immediately!`);
  };

  // UI Components helpers
  const renderSidebarContent = () => {
    switch (viewState) {
      case ViewState.AMBULANCE_TRACKING:
        return <AmbulanceView request={ambulanceRequest} />;
      
      case ViewState.AMBULANCE_SELECTION:
        return (
          <div className="p-6 h-full overflow-y-auto bg-slate-50">
             <div className="flex flex-col mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-slate-800">Available Ambulances</h2>
                <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-bold">
                  {ambulancesWithLoc.length} nearby
                </span>
              </div>
              <p className="text-sm text-slate-500 mb-2">Select a vehicle to view route and confirm dispatch.</p>
            </div>
            <div className="space-y-4 pb-20">
               {ambulancesWithLoc.map(amb => (
                 <AmbulanceCard key={amb.id} ambulance={amb} onBook={handleManualAmbulanceBooking} />
               ))}
            </div>
          </div>
        );

      case ViewState.BOOKING_FORM:
        return selectedDoctorForBooking ? (
          <BookingForm 
            doctor={selectedDoctorForBooking} 
            onSubmit={handleBookingSubmit}
            onCancel={() => setViewState(ViewState.DOCTORS)}
          />
        ) : <div className="p-6">Error: No doctor selected</div>;

      case ViewState.MY_APPOINTMENTS:
        return <AppointmentsList appointments={appointments} />;

      case ViewState.DOCTORS:
        return (
          <div className="p-6 h-full overflow-y-auto bg-slate-50">
            <div className="flex flex-col mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-slate-800">Specialists Near You</h2>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                  {filteredDoctors.length} found
                </span>
              </div>
              {userLocation && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="w-3 h-3 text-emerald-500" />
                    <span>Location detected • Sorting by proximity & rating</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 pb-20">
              {filteredDoctors.map(doc => (
                <DoctorCard key={doc.id} doctor={doc} onBook={handleBookingClick} />
              ))}
            </div>
          </div>
        );

      case ViewState.BOOKING_SUCCESS:
        return (
          <div className="h-full flex flex-col items-center justify-center bg-emerald-50 text-emerald-800 p-8 text-center animate-pulse-slow">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
               <UserPlus className="w-12 h-12 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Confirmed!</h2>
            <p className="text-lg opacity-80">Appointment has been successfully scheduled.</p>
          </div>
        );

      default: // HOME
        return (
          <div className="h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 p-8">
            <Stethoscope className="w-24 h-24 mb-6 opacity-20" />
            <p className="text-center max-w-sm mb-6">
              Your dashboard will update here based on your conversation. 
            </p>
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-4">
                <button 
                  onClick={() => handleSendMessage("Find a cardiologist nearby")}
                  className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 flex flex-col items-center gap-2"
                >
                   <UserPlus className="w-6 h-6 text-blue-500" />
                   <span className="text-sm font-semibold text-slate-700">Find Doctors</span>
                </button>
                <button 
                  onClick={() => handleSendMessage("Show me available ambulances")}
                  className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 flex flex-col items-center gap-2"
                >
                   <Siren className="w-6 h-6 text-rose-500" />
                   <span className="text-sm font-semibold text-slate-700">Book Ambulance</span>
                </button>
            </div>
            <button 
                onClick={() => setViewState(ViewState.MY_APPOINTMENTS)}
                className="w-full max-w-sm p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 flex items-center justify-center gap-2 text-slate-600 font-semibold text-sm"
            >
                <CalendarCheck className="w-4 h-4" />
                My Appointments
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-900 overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full z-50 bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-teal-400" />
          <h1 className="text-xl font-bold">VitalLink</h1>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row w-full h-full pt-16 md:pt-0">
        
        {/* Left Panel (Chat) */}
        <div className="w-full md:w-[450px] lg:w-[500px] h-full flex flex-col border-r border-slate-800 relative z-0">
           {/* Desktop Header */}
           <div className="hidden md:flex items-center gap-3 p-6 border-b border-slate-100 bg-white">
             <div className="w-10 h-10 bg-gradient-to-tr from-teal-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
             </div>
             <div>
               <h1 className="text-xl font-bold text-slate-800 tracking-tight">VitalLink AI</h1>
               <div className="flex items-center gap-1.5">
                 <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                 <span className="text-xs text-slate-500 font-medium">System Operational</span>
               </div>
             </div>
           </div>
           
           <div className="flex-1 overflow-hidden">
             <ChatInterface 
               messages={messages} 
               onSendMessage={handleSendMessage} 
               isLoading={isLoading} 
             />
           </div>
        </div>

        {/* Right Panel (Dashboard) */}
        <div className={`
          fixed md:relative top-0 right-0 w-full md:w-auto md:flex-1 h-full bg-slate-50 transition-transform duration-300 z-20 md:z-auto
          ${mobileMenuOpen ? 'translate-x-0 pt-20' : 'translate-x-full md:translate-x-0'}
        `}>
          {renderSidebarContent()}
          
          {/* Emergency FAB */}
          <div className="absolute bottom-8 right-8 z-30">
            <button 
              onClick={handleEmergency}
              className="group flex items-center gap-3 bg-rose-600 hover:bg-rose-700 text-white pl-4 pr-6 py-4 rounded-full shadow-xl shadow-rose-900/20 transition-all hover:scale-105 active:scale-95"
            >
              <div className="p-2 bg-white/20 rounded-full animate-pulse">
                <Phone className="w-5 h-5" />
              </div>
              <span className="font-bold tracking-wide">EMERGENCY</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;