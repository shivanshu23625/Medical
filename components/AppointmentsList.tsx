import React from 'react';
import { Calendar, Clock, User, CheckCircle2, MoreVertical } from 'lucide-react';
import { Appointment } from '../types';

interface AppointmentsListProps {
  appointments: Appointment[];
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({ appointments }) => {
  return (
    <div className="h-full bg-slate-50 flex flex-col p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">My Appointments</h2>
        <p className="text-sm text-slate-500">Manage your scheduled visits</p>
      </div>

      {appointments.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
           <Calendar className="w-16 h-16 mb-4 opacity-20" />
           <p>No appointments scheduled yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => (
            <div key={apt.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4 relative group hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                 <div>
                    <h3 className="font-bold text-lg text-slate-800">{apt.doctorName}</h3>
                    <p className="text-sm text-indigo-600 font-medium">{apt.department}</p>
                 </div>
                 <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                 }`}>
                    {apt.status === 'confirmed' && <CheckCircle2 className="w-3 h-3" />}
                    {apt.status.toUpperCase()}
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                 <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {apt.date}
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {apt.time}
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-600 col-span-2">
                    <User className="w-4 h-4 text-slate-400" />
                    Patient: <span className="font-medium text-slate-800">{apt.patientName}</span>
                 </div>
              </div>

              <div className="flex gap-2 mt-2">
                <button className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                    Reschedule
                </button>
                <button className="flex-1 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors">
                    Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;