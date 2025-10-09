import React from "react";
import { Phone, Calendar, Clock, Briefcase, Mail } from "lucide-react";

const BookingCard = ({ booking, onCancel, loading }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "text-blue-600 bg-blue-50";
      case "confirmed":
        return "text-blue-600 bg-blue-50";
      case "cancelled":
        return "text-gray-400 bg-gray-50";
      default:
        return "text-gray-400 bg-gray-50";
    }
  };

  return (
    <div className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden w-full">
      {/* Elegant border effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-gray-100 to-white p-px rounded-2xl">
        <div className="h-full w-full bg-white rounded-2xl"></div>
      </div>
      
      <div className="relative p-6">
        {/* Header with status badge */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <h4 className="text-lg font-light text-gray-900 mb-1 tracking-tight">
              {booking.name}
            </h4>
            <div className="flex items-center gap-2 text-gray-400 text-xs font-light">
              <Mail className="w-3 h-3" />
              <span>{booking.email}</span>
            </div>
          </div>
          <div className={`text-xs font-medium tracking-widest uppercase px-3 py-1.5 rounded-lg ${getStatusStyle(booking.status)}`}>
            {booking.status}
          </div>
        </div>

        {/* Compact 2-column grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="col-span-2 flex items-center gap-3 py-2 border-b border-gray-100">
            <Phone className="w-3.5 h-3.5 text-blue-400" />
            <div className="flex-1">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-light">Phone</p>
              <p className="text-xs text-gray-900 font-light mt-0.5">{booking.phone}</p>
            </div>
          </div>

          <div className="col-span-2 flex items-center gap-3 py-2 border-b border-gray-100">
            <Briefcase className="w-3.5 h-3.5 text-blue-400" />
            <div className="flex-1">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-light">Service</p>
              <p className="text-xs text-gray-900 font-light mt-0.5 capitalize">{booking.service}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 py-2 border-b border-gray-100">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <div className="flex-1">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-light">Date</p>
              <p className="text-xs text-gray-900 font-light mt-0.5">{booking.date}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 py-2 border-b border-gray-100">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <div className="flex-1">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-light">Time</p>
              <p className="text-xs text-gray-900 font-light mt-0.5">{booking.time}</p>
            </div>
          </div>
        </div>

        {/* Notes section - compact */}
        {booking.notes && (
          <div className="mb-5 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs uppercase tracking-widest text-blue-600 font-light mb-1.5">Notes</p>
            <p className="text-xs text-gray-600 leading-relaxed font-light">
              {booking.notes}
            </p>
          </div>
        )}

        {/* Refined action button */}
        {booking.status === "pending" && (
          <button
            onClick={() => onCancel(booking.id)}
            disabled={loading}
            className="w-full py-2.5 text-xs text-gray-900 font-light tracking-widest uppercase border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Cancel Appointment"}
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;

