import React from "react";
import { Calendar } from "lucide-react";
import BookingCard from "./BookingCard";

const BookingList = ({ bookings, onCancelBooking, loading }) => {
  if (bookings.length === 0) {
    return (
      <div className="w-full">
        <div className="mb-16">
          <h3 className="text-5xl font-light text-gray-900 tracking-tight mb-4">
            Appointments
          </h3>
          <div className="w-16 h-px bg-gradient-to-r from-gray-900 to-transparent"></div>
        </div>

        <div className="text-center py-32">
          <div className="w-16 h-16 border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
            <Calendar className="w-7 h-7 text-gray-300" />
          </div>
          <h4 className="text-xl font-light text-gray-400 mb-3 tracking-wide">
            No appointments scheduled
          </h4>
          <p className="text-sm text-gray-400 font-light tracking-wide max-w-md mx-auto leading-relaxed">
            Begin your journey to optimal dental health by scheduling your first
            consultation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-end justify-between mb-16">
        <div>
          <h3 className="text-5xl font-light text-gray-900 tracking-tight mb-4">
            Appointments
          </h3>
          <div className="w-16 h-px bg-gradient-to-r from-gray-900 to-transparent"></div>
        </div>
        <div className="text-sm text-gray-400 font-light tracking-widest uppercase">
          {bookings.length}{" "}
          {bookings.length === 1 ? "Appointment" : "Appointments"}
        </div>
      </div>

      <div className="space-y-8">
        {bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onCancel={onCancelBooking}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
};

export default BookingList;
