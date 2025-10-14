import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Briefcase,
  FileText,
  Trash2,
  MapPin,
  X,
} from "lucide-react";

const BookingCard = ({
  booking,
  onCancel,
  onConfirm,
  onSetPending,
  onSetDone,
  onDelete,
  loading,
  isAdmin = false,
  isDone = false,
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const getStatusStyle = (status) => {
    if (isDone) {
      return "text-emerald-600 bg-emerald-50 border-emerald-200";
    }
    switch (status) {
      case "pending":
        return "text-[#0056A3] bg-[#0056A3]/10 border-[#0056A3]/20";
      case "confirmed":
        return "text-[#009846] bg-[#009846]/10 border-[#009846]/20";
      case "cancelled":
        return "text-gray-400 bg-gray-50 border-gray-200";
      default:
        return "text-gray-400 bg-gray-50 border-gray-200";
    }
  };

  const getBranchName = (branchId) => {
    const branches = {
      villasis: "Villasis, Pangasinan",
      carmen: "Carmen, Rosales, Pangasinan",
    };
    return branches[branchId] || branchId;
  };

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    if (cancelReason.trim()) {
      onCancel(booking.id, cancelReason);
      setShowCancelModal(false);
      setCancelReason("");
    }
  };

  const handleCloseModal = () => {
    setShowCancelModal(false);
    setCancelReason("");
  };

  const isCancelled = booking.status === "cancelled";

  return (
    <>
      <div
        className={`group relative bg-white rounded-xl border transition-all duration-300 ${
          isCancelled || isDone
            ? "border-gray-200 opacity-60"
            : "border-gray-100 hover:border-gray-200 hover:shadow-lg"
        }`}
      >
        <div className="relative p-5">
          {/* Header with name and status */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-semibold text-gray-900 mb-1">
                {booking.name}
              </h4>
              <div className="flex items-center gap-1.5 text-gray-500">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-xs truncate">{booking.email}</span>
              </div>
            </div>
            <div
              className={`ml-3 flex-shrink-0 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-lg border ${getStatusStyle(
                booking.status
              )}`}
            >
              {isDone ? "Completed" : booking.status}
            </div>
          </div>

          {/* Info grid - Compact */}
          <div className="space-y-2 mb-4">
            {/* Branch */}
            {booking.branch && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-50/50 border border-purple-100/50">
                <MapPin className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-900 font-medium truncate">
                    {getBranchName(booking.branch)}
                  </p>
                </div>
              </div>
            )}

            {/* Phone & Service in one row */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
                <Phone className="w-3.5 h-3.5 text-[#0056A3] flex-shrink-0" />
                <p className="text-xs text-gray-900 font-medium truncate">
                  {booking.phone}
                </p>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
                <Briefcase className="w-3.5 h-3.5 text-[#009846] flex-shrink-0" />
                <p className="text-xs text-gray-900 font-medium truncate capitalize">
                  {booking.service}
                </p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
                <Calendar className="w-3.5 h-3.5 text-[#0056A3] flex-shrink-0" />
                <p className="text-xs text-gray-900 font-medium">
                  {booking.date}
                </p>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
                <Clock className="w-3.5 h-3.5 text-[#009846] flex-shrink-0" />
                <p className="text-xs text-gray-900 font-medium">
                  {booking.time}
                </p>
              </div>
            </div>
          </div>

          {/* Notes section - Compact */}
          {booking.notes && (
            <div className="mb-4 p-2.5 bg-blue-50/50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-1.5 mb-1">
                <FileText className="w-3 h-3 text-[#0056A3]" />
                <p className="text-[10px] uppercase tracking-wider text-[#0056A3] font-bold">
                  Notes
                </p>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                {booking.notes}
              </p>
            </div>
          )}

          {/* Cancellation Reason - Compact */}
          {isCancelled && booking.cancellationReason && (
            <div className="mb-4 p-2.5 bg-red-50/50 rounded-lg border border-red-100">
              <div className="flex items-center gap-1.5 mb-1">
                <XCircle className="w-3 h-3 text-red-500" />
                <p className="text-[10px] uppercase tracking-wider text-red-600 font-bold">
                  Cancellation Reason
                </p>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                {booking.cancellationReason}
              </p>
            </div>
          )}

          {/* Admin Action Buttons - Compact */}
          {isAdmin && !isDone ? (
            <div className="flex flex-wrap gap-2">
              {/* Confirm Button */}
              {booking.status !== "confirmed" && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onConfirm(booking.id);
                  }}
                  disabled={loading}
                  className="flex-1 min-w-[80px] px-3 py-1.5 text-xs font-semibold text-[#009846] bg-[#009846]/5 border border-[#009846]/20 rounded-lg hover:bg-[#009846] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm
                </button>
              )}

              {/* Mark as Done Button */}
              {booking.status === "confirmed" && onSetDone && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onSetDone(booking.id);
                  }}
                  disabled={loading}
                  className="flex-1 min-w-[80px] px-3 py-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mark Done
                </button>
              )}

              {/* Set Pending Button */}
              {booking.status !== "pending" && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onSetPending(booking.id);
                  }}
                  disabled={loading}
                  className="flex-1 min-w-[80px] px-3 py-1.5 text-xs font-semibold text-[#0056A3] bg-[#0056A3]/5 border border-[#0056A3]/20 rounded-lg hover:bg-[#0056A3] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Pending
                </button>
              )}

              {/* Cancel Button */}
              {booking.status !== "cancelled" && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleCancelClick();
                  }}
                  disabled={loading}
                  className="flex-1 min-w-[80px] px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 border border-red-200 rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              )}

              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(booking.id);
                }}
                disabled={loading}
                className="flex-1 min-w-[80px] px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            </div>
          ) : isAdmin && isDone ? (
            // Only Delete button for Done appointments
            <button
              onClick={(e) => {
                e.preventDefault();
                onDelete(booking.id);
              }}
              disabled={loading}
              className="w-full px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete
            </button>
          ) : (
            // User Cancel Button
            booking.status === "pending" && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleCancelClick();
                }}
                disabled={loading}
                className="w-full px-3 py-2 text-xs font-semibold text-red-500 bg-red-50 border border-red-200 rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Cancel Appointment"}
              </button>
            )
          )}
        </div>
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Cancel Appointment
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Please provide a reason for cancellation
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <label className="block mb-1.5 text-xs font-semibold text-gray-700">
                Reason for Cancellation <span className="text-red-500">*</span>
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please explain why you're cancelling this appointment..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0056A3] focus:border-transparent resize-none text-xs"
              />
              <p className="mt-1.5 text-[10px] text-gray-500">
                This information helps us improve our services
              </p>
            </div>

            {/* Footer */}
            <div className="flex gap-2 p-4 border-t border-gray-100">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={!cancelReason.trim() || loading}
                className="flex-1 px-3 py-2 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingCard;
