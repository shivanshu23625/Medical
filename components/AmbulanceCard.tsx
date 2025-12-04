import React from 'react';
import { Siren, Clock, Shield, DollarSign, Navigation, Activity } from 'lucide-react';
import { Ambulance } from '../types';

interface AmbulanceCardProps {
  ambulance: Ambulance;
  onBook: (ambulance: Ambulance) => void;
}

const AmbulanceCard: React.FC<AmbulanceCardProps> = ({ ambulance, onBook }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-slate-100 overflow-hidden group">
      <div className="flex flex-col sm:flex-row">
        {/* Image / Type Section */}
        <div className="w-full sm:w-32 h-32 sm:h-auto relative bg-slate-100 shrink-0">
          <img 
            src={ambulance.image} 
            alt={ambulance.type} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
            {ambulance.eta} away
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-slate-800">{ambulance.provider}</h3>
                <p className="text-xs font-semibold text-rose-500 uppercase tracking-wide">{ambulance.type}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  {ambulance.fees}
                </span>
                {ambulance.distance && (
                   <span className="text-xs text-slate-400">{ambulance.distance.toFixed(1)} km</span>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-4">
              {ambulance.features.map((feature, idx) => (
                <span key={idx} className="bg-slate-50 text-slate-600 px-2 py-1 rounded text-xs border border-slate-100">
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-auto">
             <button 
                onClick={() => onBook(ambulance)}
                className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-700 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 border border-rose-200"
             >
                <Siren className="w-4 h-4" />
                Book Now
             </button>
             <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <Navigation className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmbulanceCard;