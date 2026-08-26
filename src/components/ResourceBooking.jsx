import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle, 
  PlusCircle, 
  Monitor, 
  Cpu, 
  Award,
  BookmarkCheck
} from 'lucide-react';

export default function ResourceBooking({ resources, workshops, onBookResource, onRegisterWorkshop }) {
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookedIds, setBookedIds] = useState([]);

  const handleConfirmBooking = () => {
    if (!selectedSlot || !selectedResource) return;
    onBookResource(selectedResource, selectedSlot);
    setBookedIds([...bookedIds, `${selectedResource.id}-${selectedSlot}`]);
    setSelectedResource(null);
    setSelectedSlot('');
  };

  return (
    <div className="space-y-8">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 md:p-8 rounded-2xl border border-blue-500/30 shadow-xl">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-2">
          <Calendar className="h-3.5 w-3.5 text-blue-400" />
          Campus Infrastructure Management
        </span>
        <h1 className="text-2xl font-extrabold text-white">Campus Lab & Discussion Room Booking</h1>
        <p className="text-sm text-slate-300 mt-1 max-w-2xl">
          Reserve high-performance GPU workstations (NVIDIA RTX 4090s), discussion rooms for hackathon team meetings, or register for peer-led technical workshops.
        </p>
      </div>

      {/* Section 1: Labs & Discussion Rooms */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Monitor className="h-5 w-5 text-indigo-400" />
          Available Campus Infrastructure & Labs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {resources.map((res) => (
            <div
              key={res.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-slate-100 text-sm">{res.name}</h3>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded font-semibold">
                    {res.status}
                  </span>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{res.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Capacity: {res.capacity}</span>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {res.amenities.map(a => (
                    <span key={a} className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                      ✓ {a}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedResource(res)}
                className="w-full py-2 bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow-md transition"
              >
                Reserve Slot
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Student-Led Workshops */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="h-5 w-5 text-purple-400" />
          Upcoming Peer Technical Workshops
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {workshops.map((ws) => (
            <div
              key={ws.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2.5 py-0.5 rounded-full font-bold">
                    Peer Workshop
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {ws.attendees} / {ws.maxAttendees} Registered
                  </span>
                </div>

                <h3 className="font-bold text-slate-100 text-base">{ws.title}</h3>
                <p className="text-xs text-slate-400">Speaker: <strong className="text-slate-200">{ws.speaker}</strong></p>

                <div className="flex items-center gap-4 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-purple-400" />
                    <span>{ws.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-purple-400" />
                    <span>{ws.venue}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onRegisterWorkshop(ws)}
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg shadow-md transition"
              >
                Register for Free
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Slot Modal */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-400" />
              Select Reservation Time Slot
            </h3>

            <p className="text-xs text-slate-300">
              Reserving: <strong className="text-white">{selectedResource.name}</strong>
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Available Time Slots for Today</label>
              <div className="space-y-2">
                {selectedResource.availableSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`w-full p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition ${
                      selectedSlot === slot
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{slot}</span>
                    {selectedSlot === slot && <BookmarkCheck className="h-4 w-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                onClick={() => setSelectedResource(null)}
                className="flex-1 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                disabled={!selectedSlot}
                onClick={handleConfirmBooking}
                className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-md"
              >
                Confirm Reservation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
