import React from "react";
import { Calendar } from "lucide-react";
import BookingCard from "./BookingCard";

const BookingList = ({ bookings, onCancelBooking, loading }) => {
  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Bookings</h3>
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            No bookings yet. Create your first booking!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Bookings</h3>
      <div className="space-y-4">
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