import React from 'react';
import { Star, Clock, MapPin, CalendarCheck, DollarSign, CalendarDays, ExternalLink, Trophy } from 'lucide-react';
import { Doctor } from '../types';

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook }) => {
  const openMap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (doctor.coordinates) {
      const url = `https://www.google.com/maps/search/?api=1&query=${doctor.coordinates.lat},${doctor.coordinates.lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border flex flex-col group relative ${doctor.isBestMatch ? 'border-amber-400 ring-2 ring-amber-100' : 'border-slate-100'}`}>
      
      {doctor.isBestMatch && (
        <div className="absolute top-0 right-0 z-20 bg-amber-400 text-white text-xs font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm">
          <Trophy className="w-3 h-3" />
          Best Match
        </div>
      )}

      {/* Header Image Section */}
      <div className="relative h-28 bg-gradient-to-r from-blue-600 to-cyan-500 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')]"></div>
        <div className="absolute -bottom-10 left-4 z-10">
          <img 
            src={doctor.image} 
            alt={doctor.name} 
            className={`w-20 h-20 rounded-full border-4 shadow-md object-cover transition-transform duration-300 group-hover:scale-105 ${doctor.isBestMatch ? 'border-amber-100' : 'border-white'}`}
          />
        </div>
        {!doctor.isBestMatch && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold text-slate-700 shadow-sm border border-slate-100">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span>{doctor.rating}</span>
          </div>
        )}
      </div>
      
      <div className="pt-12 pb-5 px-5 flex-1 flex flex-col">
        {/* Basic Info */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-800 leading-tight mb-1 flex items-center justify-between">
            {doctor.name}
            {doctor.rating >= 4.8 && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 ml-1 inline" />}
          </h3>
          <p className="text-teal-600 text-sm font-semibold uppercase tracking-wide">{doctor.department}</p>
        </div>
        
        {/* Details Grid */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
             <div className="flex items-start gap-2 max-w-[70%]">
                <MapPin className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                <div>
                   <span className="text-sm text-slate-600 leading-snug block">{doctor.location}</span>
                   {doctor.distance !== undefined && (
                     <span className="text-xs text-indigo-600 font-medium">
                       {doctor.distance.toFixed(1)} km away
                     </span>
                   )}
                </div>
             </div>
             {doctor.coordinates && (
                <button 
                  onClick={openMap}
                  className="text-xs flex items-center gap-1 text-blue-500 hover:text-blue-700 hover:underline"
                >
                  View Map <ExternalLink className="w-3 h-3" />
                </button>
             )}
          </div>

          <div className="flex items-center gap-3">
             <CalendarDays className="w-4 h-4 text-slate-400 shrink-0" />
             <span className="text-sm text-slate-600">{doctor.timings}</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-2">
            <div className="flex items-center gap-2">
                <div className="bg-emerald-50 p-1.5 rounded-md text-emerald-600">
                    <DollarSign className="w-4 h-4" />
                </div>
                <div>
                    <span className="text-xs text-slate-400 block font-medium">Consultation Fee</span>
                    <span className="font-bold text-slate-700">₹{doctor.fees}</span>
                </div>
            </div>
            
            <div className="flex items-center gap-2 text-right">
                <div className="bg-blue-50 p-1.5 rounded-md text-blue-600">
                    <Clock className="w-4 h-4" />
                </div>
                <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Experience</span>
                    <span className="font-bold text-slate-700">{doctor.experience} yrs</span>
                </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between text-xs font-medium bg-slate-50 p-2 rounded-lg border border-slate-100">
             <span className="text-slate-500">Next Available Slot</span>
             <span className="text-indigo-600 flex items-center gap-1">
                <CalendarCheck className="w-3 h-3" />
                {doctor.nextSlot}
             </span>
          </div>

          <button 
            onClick={() => onBook(doctor)}
            className={`w-full text-white py-2.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg active:scale-[0.98] flex items-center justify-center gap-2
              ${doctor.isBestMatch 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-200' 
                : 'bg-slate-900 hover:bg-slate-800 shadow-slate-200'}`}
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;