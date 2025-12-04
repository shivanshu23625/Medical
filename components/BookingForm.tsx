import React, { useState } from 'react';
import { Calendar, Clock, User, FileText, X, ChevronRight } from 'lucide-react';
import { Doctor } from '../types';

interface BookingFormProps {
  doctor: Doctor;
  onSubmit: (data: { date: string; time: string; patientName: string; reason: string }) => void;
  onCancel: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ doctor, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    date: '',
    time: '',
    reason: ''
  });

  // Mock slots generation
  const morningSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '11:15 AM'];
  const eveningSlots = ['04:00 PM', '04:30 PM', '05:15 PM', '06:00 PM'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col overflow-y-auto">
      <div className="bg-white p-6 shadow-sm border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Book Appointment</h2>
          <p className="text-sm text-slate-500">with {doctor.name}</p>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Doctor Summary */}
          <div className="flex items-center gap-4 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
            <div>
              <div className="font-bold text-slate-800">{doctor.name}</div>
              <div className="text-xs font-semibold text-indigo-600 uppercase">{doctor.department}</div>
              <div className="text-sm text-slate-500 mt-1">Fees: ₹{doctor.fees}</div>
            </div>
          </div>

          {/* Patient Details */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" /> Patient Name
            </label>
            <input 
              type="text" 
              required
              className="w-full p-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Enter full name"
              value={formData.patientName}
              onChange={e => setFormData({...formData, patientName: e.target.value})}
            />
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" /> Preferred Date
            </label>
            <input 
              type="date" 
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>

          {/* Time Slot Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" /> Available Slots
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <span className="text-xs text-slate-400 font-medium">Morning</span>
                <div className="grid grid-cols-2 gap-2">
                  {morningSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setFormData({...formData, time: slot})}
                      className={`text-xs py-2 px-1 rounded-md border transition-all ${formData.time === slot ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-xs text-slate-400 font-medium">Evening</span>
                <div className="grid grid-cols-2 gap-2">
                  {eveningSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setFormData({...formData, time: slot})}
                      className={`text-xs py-2 px-1 rounded-md border transition-all ${formData.time === slot ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" /> Reason for Visit
            </label>
            <textarea 
              className="w-full p-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none h-24"
              placeholder="Describe symptoms or purpose..."
              value={formData.reason}
              onChange={e => setFormData({...formData, reason: e.target.value})}
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={!formData.date || !formData.time || !formData.patientName}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Confirm Appointment <ChevronRight className="w-5 h-5" />
            </button>
            <p className="text-center text-xs text-slate-400 mt-3">
              By booking, you agree to the clinic's terms of service.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;