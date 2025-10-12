import React from "react";
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
} from "lucide-react";

const BookingCard = ({
  booking,
  onCancel,
  onConfirm,
  onSetPending,
  onDelete,
  loading,
  isAdmin = false,
}) => {
  const getStatusStyle = (status) => {
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

  const isCancelled = booking.status === "cancelled";

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-300 ${
        isCancelled
          ? "border-gray-200 opacity-60"
          : "border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100"
      }`}
    >
      <div className="relative p-8">
        {/* Header with name and status */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h4 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">
              {booking.name}
            </h4>
            <div className="flex items-center gap-2 text-gray-500">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm truncate">{booking.email}</span>
            </div>
          </div>
          <div
            className={`ml-4 flex-shrink-0 text-xs font-bold tracking-[0.15em] uppercase px-4 py-2 rounded-xl border ${getStatusStyle(
              booking.status
            )}`}
          >
            {booking.status}
          </div>
        </div>

        {/* Info grid */}
        <div className="space-y-4 mb-6">
          {/* Branch */}
          {booking.branch && (
            <div className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-[0.1em] text-purple-600 font-semibold mb-1">
                  Branch Location
                </p>
                <p className="text-base text-gray-900 font-medium">
                  {getBranchName(booking.branch)}
                </p>
              </div>
            </div>
          )}

          {/* Phone */}
          <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50/50 border border-gray-100">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#0056A3] to-[#0056A3]/80 flex items-center justify-center">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-[0.1em] text-gray-500 font-semibold mb-1">
                Phone
              </p>
              <p className="text-base text-gray-900 font-medium">
                {booking.phone}
              </p>
            </div>
          </div>

          {/* Service */}
          <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50/50 border border-gray-100">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#009846] to-[#009846]/80 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-[0.1em] text-gray-500 font-semibold mb-1">
                Service
              </p>
              <p className="text-base text-gray-900 font-medium capitalize">
                {booking.service}
              </p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-100">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#0056A3] to-[#0056A3]/80 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-[0.1em] text-gray-500 font-semibold mb-1">
                  Date
                </p>
                <p className="text-sm text-gray-900 font-medium">
                  {booking.date}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-100">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#009846] to-[#009846]/80 flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-[0.1em] text-gray-500 font-semibold mb-1">
                  Time
                </p>
                <p className="text-sm text-gray-900 font-medium">
                  {booking.time}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes section */}
        {booking.notes && (
          <div className="mb-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-[#0056A3]" />
              <p className="text-xs uppercase tracking-[0.1em] text-[#0056A3] font-bold">
                Notes
              </p>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {booking.notes}
            </p>
          </div>
        )}

        {/* Admin Action Buttons */}
        {isAdmin ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {/* Confirm Button */}
              {booking.status !== "confirmed" && (
                <button
                  onClick={() => onConfirm(booking.id)}
                  disabled={loading}
                  className="group/btn relative overflow-hidden transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="relative px-4 py-3 bg-white border border-gray-200 rounded-xl transition-all duration-500 group-hover/btn:border-transparent group-hover/btn:shadow-lg group-hover/btn:shadow-green-500/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#009846] to-[#009846]/80 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#009846] group-hover/btn:text-white transition-colors duration-500" />
                      <span className="text-sm font-semibold tracking-wide text-gray-700 group-hover/btn:text-white transition-colors duration-500">
                        Confirm
                      </span>
                    </div>
                  </div>
                </button>
              )}

              {/* Set Pending Button */}
              {booking.status !== "pending" && (
                <button
                  onClick={() => onSetPending(booking.id)}
                  disabled={loading}
                  className="group/btn relative overflow-hidden transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="relative px-4 py-3 bg-white border border-gray-200 rounded-xl transition-all duration-500 group-hover/btn:border-transparent group-hover/btn:shadow-lg group-hover/btn:shadow-blue-500/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0056A3] to-[#0056A3]/80 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4 text-[#0056A3] group-hover/btn:text-white transition-colors duration-500" />
                      <span className="text-sm font-semibold tracking-wide text-gray-700 group-hover/btn:text-white transition-colors duration-500">
                        Pending
                      </span>
                    </div>
                  </div>
                </button>
              )}

              {/* Cancel Button */}
              {booking.status !== "cancelled" && (
                <button
                  onClick={() => onCancel(booking.id)}
                  disabled={loading}
                  className="group/btn relative overflow-hidden transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="relative px-4 py-3 bg-white border border-gray-200 rounded-xl transition-all duration-500 group-hover/btn:border-transparent group-hover/btn:shadow-lg group-hover/btn:shadow-red-500/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500 group-hover/btn:text-white transition-colors duration-500" />
                      <span className="text-sm font-semibold tracking-wide text-gray-700 group-hover/btn:text-white transition-colors duration-500">
                        Cancel
                      </span>
                    </div>
                  </div>
                </button>
              )}
            </div>

            {/* Delete Button - Full Width */}
            <button
              onClick={() => onDelete(booking.id)}
              disabled={loading}
              className="group/btn relative w-full overflow-hidden transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="relative px-4 py-3 bg-white border border-gray-200 rounded-xl transition-all duration-500 group-hover/btn:border-transparent group-hover/btn:shadow-lg group-hover/btn:shadow-gray-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-700 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <Trash2 className="w-4 h-4 text-gray-600 group-hover/btn:text-white transition-colors duration-500" />
                  <span className="text-sm font-semibold tracking-wide text-gray-700 group-hover/btn:text-white transition-colors duration-500">
                    Delete Permanently
                  </span>
                </div>
              </div>
            </button>
          </div>
        ) : (
          // User Cancel Button
          booking.status === "pending" && (
            <button
              onClick={() => onCancel(booking.id)}
              disabled={loading}
              className="group/btn relative w-full overflow-hidden transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="relative px-6 py-3.5 bg-white border border-gray-200 rounded-xl transition-all duration-500 group-hover/btn:border-transparent group-hover/btn:shadow-lg group-hover/btn:shadow-red-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                <span className="relative z-10 text-sm font-semibold tracking-[0.15em] uppercase text-gray-700 group-hover/btn:text-white transition-colors duration-500">
                  {loading ? "Processing..." : "Cancel Appointment"}
                </span>
              </div>
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default BookingCard;
