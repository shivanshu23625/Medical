import React, { useEffect, useState } from 'react';
import { Ambulance, MapPin, Navigation, Siren, ShieldCheck, Activity } from 'lucide-react';
import { AmbulanceRequest, RouteStep } from '../types';
import { MOCK_ROUTE } from '../constants';

interface AmbulanceViewProps {
  request: AmbulanceRequest;
}

const AmbulanceView: React.FC<AmbulanceViewProps> = ({ request }) => {
  const [activeStep, setActiveStep] = useState(0);

  // Simulate movement along route
  useEffect(() => {
    if (activeStep < MOCK_ROUTE.length - 1) {
      const timer = setTimeout(() => {
        setActiveStep(prev => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeStep]);

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-y-auto">
      {/* Header Status */}
      <div className="bg-rose-500 text-white p-6 shadow-lg rounded-b-3xl relative overflow-hidden shrink-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,white,transparent)] animate-spin-slow"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full animate-pulse">
                <Siren className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Emergency Mode</h2>
                <p className="text-rose-100 text-sm">Priority Dispatch Active</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold font-mono">{request.eta}</div>
              <div className="text-xs text-rose-100 uppercase tracking-wider">Estimated Arrival</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-rose-600 font-bold">
                <Ambulance className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-rose-100">Vehicle ID</div>
                <div className="font-semibold">AMB-749</div>
              </div>
            </div>
             <div className="h-8 w-[1px] bg-white/20"></div>
             <div>
                <div className="text-xs text-rose-100">Destination</div>
                <div className="font-semibold text-sm">{request.hospital}</div>
             </div>
          </div>
        </div>
      </div>

      {/* Route Visualization */}
      <div className="p-6 flex-1">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-indigo-500" />
              Optimal Rush-Free Route
            </h3>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Traffic Avoided
            </span>
          </div>

          <div className="flex-1 relative pl-4 border-l-2 border-slate-100 space-y-8">
            {MOCK_ROUTE.map((step, index) => {
              const isActive = index === activeStep;
              const isPast = index < activeStep;

              return (
                <div key={index} className={`relative transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : isPast ? 'opacity-50' : 'opacity-70'}`}>
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[25px] top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white z-10
                    ${isActive ? 'border-indigo-500 animate-pulse' : isPast ? 'border-emerald-500' : 'border-slate-300'}
                  `}>
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-indigo-500' : isPast ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                  </div>

                  <div className={`p-4 rounded-xl border ${isActive ? 'bg-indigo-50 border-indigo-200 shadow-md' : 'bg-white border-slate-100'}`}>
                    <p className="font-medium text-slate-800">{step.instruction}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Navigation className="w-3 h-3" /> {step.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity className="w-3 h-3" /> {step.duration}
                      </span>
                      {step.trafficStatus === 'clear' && (
                        <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                          Clear Road
                        </span>
                      )}
                      {step.trafficStatus === 'moderate' && (
                        <span className="text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded">
                          Moderate Traffic
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmbulanceView;
