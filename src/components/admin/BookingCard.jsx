// src/components/BookingCard.jsx
import React from 'react';
import { User, Mail, Phone, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

const BookingCard = ({ 
  booking, 
  onCancel, 
  onConfirm, 
  onSetPending, 
  onDelete, 
  loading,
  isAdmin = false 
}) => {
  const statusColors = {
    pending: {
      dot: 'bg-yellow-400',
      badge: 'bg-yellow-100 text-yellow-800'
    },
    confirmed: {
      dot: 'bg-green-400',
      badge: 'bg-green-100 text-green-800'
    },
    cancelled: {
      dot: 'bg-red-400',
      badge: 'bg-red-100 text-red-800'
    }
  };

  const status = statusColors[booking.status] || statusColors.pending;

  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${status.dot}`} />
          <span className="font-semibold text-gray-800 capitalize">{booking.service}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.badge}`}>
            {booking.status}
          </span>
        </div>
      </div>

      <div className={`grid ${isAdmin ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 text-sm ${isAdmin ? 'mb-4' : ''}`}>
        <div className="flex items-center space-x-2 text-gray-600">
          <User className="w-4 h-4" />
          <span>{booking.name}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Mail className="w-4 h-4" />
          <span>{booking.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{booking.phone}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{booking.date}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{booking.time}</span>
        </div>
      </div>

      {booking.notes && (
        <div className={`${isAdmin ? 'mb-4' : 'mt-4'} p-3 ${isAdmin ? 'bg-gray-50' : 'pt-4 border-t border-gray-100'} rounded-lg`}>
          <p className="text-sm text-gray-600">{booking.notes}</p>
        </div>
      )}

      {isAdmin ? (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
          {booking.status !== 'confirmed' && (
            <button
              onClick={() => onConfirm(booking.id)}
              disabled={loading}
              className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Confirm</span>
            </button>
          )}
          {booking.status !== 'pending' && (
            <button
              onClick={() => onSetPending(booking.id)}
              disabled={loading}
              className="flex items-center space-x-1 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium disabled:opacity-50"
            >
              <Clock className="w-4 h-4" />
              <span>Set Pending</span>
            </button>
          )}
          {booking.status !== 'cancelled' && (
            <button
              onClick={() => onCancel(booking.id)}
              disabled={loading}
              className="flex items-center space-x-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          )}
          <button
            onClick={() => onDelete(booking.id)}
            disabled={loading}
            className="flex items-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50 ml-auto"
          >
            <XCircle className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      ) : (
        booking.status === 'pending' && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
            <button
              onClick={() => onCancel(booking.id)}
              disabled={loading}
              className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default BookingCard;