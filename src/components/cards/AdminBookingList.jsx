import React from "react";
import { Calendar, Archive, CheckCircle2, Clock } from "lucide-react";
import BookingCard from "../cards/BookingCard";

const AdminBookingList = ({
  bookings, // This receives the already filtered bookings from parent
  onCancel,
  onConfirm,
  onSetPending,
  onDelete,
  loading,
}) => {
  // Further separate the filtered bookings by status
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  );
  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed"
  );
  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "cancelled"
  );

  // If no bookings at all (after filtering)
  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No bookings found</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-16">
      {/* Pending Appointments Section */}
      {pendingBookings.length > 0 && (
        <div>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h3 className="text-4xl font-light text-gray-900 tracking-tight mb-4 flex items-center gap-4">
                <Clock className="w-9 h-9 text-[#0056A3]" />
                Pending Appointments
              </h3>
              <div className="w-16 h-px bg-gradient-to-r from-[#0056A3] to-transparent"></div>
            </div>
            <div className="text-sm text-gray-400 font-light tracking-widest uppercase">
              {pendingBookings.length}{" "}
              {pendingBookings.length === 1 ? "Appointment" : "Appointments"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={onCancel}
                onConfirm={onConfirm}
                onSetPending={onSetPending}
                onDelete={onDelete}
                loading={loading}
                isAdmin={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Confirmed Appointments Section */}
      {confirmedBookings.length > 0 && (
        <div>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h3 className="text-4xl font-light text-gray-900 tracking-tight mb-4 flex items-center gap-4">
                <CheckCircle2 className="w-9 h-9 text-[#009846]" />
                Confirmed Appointments
              </h3>
              <div className="w-16 h-px bg-gradient-to-r from-[#009846] to-transparent"></div>
            </div>
            <div className="text-sm text-gray-400 font-light tracking-widest uppercase">
              {confirmedBookings.length}{" "}
              {confirmedBookings.length === 1 ? "Appointment" : "Appointments"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {confirmedBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={onCancel}
                onConfirm={onConfirm}
                onSetPending={onSetPending}
                onDelete={onDelete}
                loading={loading}
                isAdmin={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Cancelled Appointments Section */}
      {cancelledBookings.length > 0 && (
        <div>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h3 className="text-3xl font-light text-gray-500 tracking-tight mb-4 flex items-center gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cancelledBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={onCancel}
                onConfirm={onConfirm}
                onSetPending={onSetPending}
                onDelete={onDelete}
                loading={loading}
                isAdmin={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookingList;
