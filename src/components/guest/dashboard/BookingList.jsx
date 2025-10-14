import React from "react";
import { Calendar, Archive } from "lucide-react";
import BookingCard from "./BookingCard";

const BookingList = ({ bookings, onCancelBooking, loading }) => {
  // Separate active and cancelled bookings
  const activeBookings = bookings.filter(
    (booking) => booking.status !== "cancelled"
  );
  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "cancelled"
  );

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
      {/* Active Appointments Section */}
      {activeBookings.length > 0 && (
        <div className="mb-16">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h3 className="text-5xl font-light text-gray-900 tracking-tight mb-4">
                Active Appointments
              </h3>
              <div className="w-16 h-px bg-gradient-to-r from-gray-900 to-transparent"></div>
            </div>
            <div className="text-sm text-gray-400 font-light tracking-widest uppercase">
              {activeBookings.length}{" "}
              {activeBookings.length === 1 ? "Appointment" : "Appointments"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={onCancelBooking}
                loading={loading}
              />
            ))}
          </div>
        </div>
      )}

      {/* Cancelled Appointments Section */}
      {cancelledBookings.length > 0 && (
        <div className="mb-16">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h3 className="text-4xl font-light text-gray-500 tracking-tight mb-4 flex items-center gap-3">
                <Archive className="w-8 h-8" />
                Cancelled Appointments
              </h3>
              <div className="w-16 h-px bg-gradient-to-r from-gray-400 to-transparent"></div>
            </div>
            <div className="text-sm text-gray-400 font-light tracking-widest uppercase">
              {cancelledBookings.length}{" "}
              {cancelledBookings.length === 1 ? "Cancelled" : "Cancelled"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cancelledBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={onCancelBooking}
                loading={loading}
              />
            ))}
          </div>
        </div>
      )}

      {/* Show message if only cancelled bookings exist */}
      {activeBookings.length === 0 && cancelledBookings.length > 0 && (
        <div className="text-center py-16 mb-16">
          <div className="w-16 h-16 border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-7 h-7 text-gray-300" />
          </div>
          <h4 className="text-xl font-light text-gray-400 mb-3 tracking-wide">
            No active appointments
          </h4>
          <p className="text-sm text-gray-400 font-light tracking-wide max-w-md mx-auto leading-relaxed">
            Schedule a new appointment to continue your dental care journey.
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingList;
