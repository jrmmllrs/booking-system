import React from "react";
import { Phone, Calendar, Clock } from "lucide-react";

const BookingCard = ({ booking, onCancel, loading }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-1">
            {booking.name}
          </h4>
          <p className="text-sm text-gray-600">{booking.email}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            booking.status
          )}`}
        >
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-gray-600">
          <Phone className="w-4 h-4" />
          <span className="text-sm">{booking.phone}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="text-sm capitalize">{booking.service}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{booking.date}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{booking.time}</span>
        </div>
      </div>

      {booking.notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Notes:</span> {booking.notes}
          </p>
        </div>
      )}

      {booking.status === "pending" && (
        <button
          onClick={() => onCancel(booking.id)}
          disabled={loading}
          className="text-red-600 hover:text-red-700 font-medium text-sm disabled:opacity-50"
        >
          Cancel Booking
        </button>
      )}
    </div>
  );
};

export default BookingCard;