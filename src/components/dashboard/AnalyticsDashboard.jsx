// src/components/dashboard/AnalyticsDashboard.jsx
import React, { useMemo, useState } from "react";
import {
  Calendar,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  User,
  X,
  Mail,
  Phone,
  MapPin,
  FileText,
  Building2,
  XCircle,
} from "lucide-react";

const AnalyticsDashboard = ({ bookings }) => {
  const [expandedDays, setExpandedDays] = useState({});
  const [selectedBooking, setSelectedBooking] = useState(null);

  const upcomingData = useMemo(() => {
    // Get next 7 days
    const today = new Date();
    const next7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      return date;
    });

    // Map bookings to days
    const calendarData = next7Days.map((date) => {
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const dateStr = date.toISOString().split("T")[0];
      const dayNum = date.getDate();
      const monthName = date.toLocaleDateString("en-US", { month: "short" });

      const dayBookings = bookings.filter((booking) => {
        if (!booking.date || booking.status === "cancelled") return false;
        const bookingDate = booking.date.includes("-")
          ? booking.date
          : new Date(booking.date).toISOString().split("T")[0];
        return bookingDate === dateStr;
      });

      // Sort by time
      dayBookings.sort((a, b) => {
        const timeA = a.time || "00:00";
        const timeB = b.time || "00:00";
        return timeA.localeCompare(timeB);
      });

      const isToday = dateStr === today.toISOString().split("T")[0];

      return {
        dayName,
        dayNum,
        monthName,
        date: dateStr,
        bookings: dayBookings,
        isToday,
        confirmedCount: dayBookings.filter((b) => b.status === "confirmed")
          .length,
        pendingCount: dayBookings.filter((b) => b.status === "pending").length,
      };
    });

    const totalUpcoming = calendarData.reduce(
      (sum, d) => sum + d.bookings.length,
      0
    );
    const confirmedUpcoming = calendarData.reduce(
      (sum, d) => sum + d.confirmedCount,
      0
    );
    const pendingUpcoming = calendarData.reduce(
      (sum, d) => sum + d.pendingCount,
      0
    );

    return {
      calendarData,
      totalUpcoming,
      confirmedUpcoming,
      pendingUpcoming,
    };
  }, [bookings]);

  const toggleDay = (date) => {
    setExpandedDays((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-[#009846]/10 text-[#009846] border-[#009846]/20";
      case "pending":
        return "bg-[#0056A3]/10 text-[#0056A3] border-[#0056A3]/20";
      case "cancelled":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-[#009846]";
      case "pending":
        return "bg-[#0056A3]";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";

    // Handle Firestore Timestamp object
    if (timestamp.toDate && typeof timestamp.toDate === "function") {
      return timestamp.toDate().toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // Handle regular date string or Date object
    const date = new Date(timestamp);
    if (!isNaN(date.getTime())) {
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return "N/A";
  };

  return (
    <>
      {/* Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 transition-colors group z-10"
            >
              <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            </button>

            {/* Modal Content */}
            <div className="p-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-[0.15em] border ${getStatusStyle(
                    selectedBooking.status
                  )}`}
                >
                  {selectedBooking.status}
                </span>
                <div
                  className={`w-3 h-3 rounded-full ${getStatusDot(
                    selectedBooking.status
                  )}`}
                />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Appointment Details
              </h3>

              {/* Details */}
              <div className="space-y-4">
                {/* Name */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0056A3] to-[#009846] flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                      Client Name
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedBooking.name}
                    </p>
                  </div>
                </div>

                {/* Service */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                      Service
                    </p>
                    <p className="text-base font-semibold text-gray-900 capitalize">
                      {selectedBooking.service}
                    </p>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                      Date & Time
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {new Date(selectedBooking.date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {selectedBooking.time}
                    </p>
                  </div>
                </div>

                {/* Branch */}
                {selectedBooking.branch && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                        Branch
                      </p>
                      <p className="text-base font-semibold text-gray-900 capitalize">
                        {selectedBooking.branch}
                      </p>
                    </div>
                  </div>
                )}

                {/* Email */}
                {selectedBooking.email && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                        Email
                      </p>
                      <p className="text-base font-semibold text-gray-900 break-all">
                        {selectedBooking.email}
                      </p>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {selectedBooking.phone && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                        Phone
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        {selectedBooking.phone}
                      </p>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedBooking.notes &&
                  selectedBooking.notes.trim() !== "" && (
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                          Notes
                        </p>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {selectedBooking.notes}
                      </p>
                    </div>
                  )}

                {/* Cancellation Info */}
                {selectedBooking.status === "cancelled" && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                    <div className="flex items-center gap-2 mb-3">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <p className="text-xs text-red-600 uppercase tracking-wider font-semibold">
                        Cancellation Details
                      </p>
                    </div>

                    {selectedBooking.cancellationReason && (
                      <div className="mb-3">
                        <p className="text-xs text-red-500 font-medium mb-1">
                          Reason:
                        </p>
                        <p className="text-sm text-red-700 font-semibold">
                          {selectedBooking.cancellationReason}
                        </p>
                      </div>
                    )}

                    {selectedBooking.cancelledAt && (
                      <div>
                        <p className="text-xs text-red-500 font-medium mb-1">
                          Cancelled At:
                        </p>
                        <p className="text-sm text-red-700">
                          {formatTimestamp(selectedBooking.cancelledAt)}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Timestamps */}
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  {selectedBooking.createdAt && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Created:</span>
                      <span className="text-gray-700 font-medium">
                        {formatTimestamp(selectedBooking.createdAt)}
                      </span>
                    </div>
                  )}
                  {selectedBooking.updatedAt && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Last Updated:</span>
                      <span className="text-gray-700 font-medium">
                        {formatTimestamp(selectedBooking.updatedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-[#0056A3] to-[#009846] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#0056A3]/20 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 transition-all duration-300 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
                Upcoming Appointments
              </h3>
              <p className="text-sm text-gray-500">Next 7 days overview</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0056A3] to-[#009846] flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100 text-center">
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {upcomingData.totalUpcoming}
              </p>
              <p className="text-xs uppercase tracking-[0.1em] text-gray-600 font-semibold">
                Total
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#009846]/5 border border-[#009846]/20 text-center">
              <p className="text-3xl font-bold text-[#009846] mb-1">
                {upcomingData.confirmedUpcoming}
              </p>
              <p className="text-xs uppercase tracking-[0.1em] text-[#009846] font-semibold">
                Confirmed
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#0056A3]/5 border border-[#0056A3]/20 text-center">
              <p className="text-3xl font-bold text-[#0056A3] mb-1">
                {upcomingData.pendingUpcoming}
              </p>
              <p className="text-xs uppercase tracking-[0.1em] text-[#0056A3] font-semibold">
                Pending
              </p>
            </div>
          </div>

          {/* Calendar Days */}
          <div className="space-y-3">
            {upcomingData.calendarData.map((day, idx) => {
              const isExpanded = expandedDays[day.date];
              const hasMoreThanTwo = day.bookings.length > 2;
              const displayBookings = isExpanded
                ? day.bookings
                : day.bookings.slice(0, 2);

              return (
                <div
                  key={idx}
                  className={`rounded-xl border transition-all ${
                    day.isToday
                      ? "bg-gradient-to-r from-[#0056A3]/5 to-[#009846]/5 border-[#0056A3]/20"
                      : "bg-gray-50/30 border-gray-100"
                  }`}
                >
                  <div className="p-4">
                    {/* Day Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`text-center rounded-xl p-2.5 min-w-[60px] ${
                            day.isToday
                              ? "bg-gradient-to-br from-[#0056A3] to-[#009846] text-white shadow-lg"
                              : "bg-white border border-gray-200 text-gray-700"
                          }`}
                        >
                          <p className="text-xs font-bold uppercase tracking-wider">
                            {day.dayName}
                          </p>
                          <p className="text-lg font-bold">{day.dayNum}</p>
                        </div>
                        {day.isToday && (
                          <span className="px-3 py-1.5 bg-[#0056A3]/10 text-[#0056A3] text-xs font-bold uppercase tracking-[0.15em] rounded-xl border border-[#0056A3]/20">
                            Today
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-700">
                          {day.bookings.length}{" "}
                          {day.bookings.length === 1
                            ? "appointment"
                            : "appointments"}
                        </span>
                        {day.confirmedCount > 0 && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#009846]/10">
                            <div className="w-2 h-2 rounded-full bg-[#009846]" />
                            <span className="text-xs font-bold text-[#009846]">
                              {day.confirmedCount}
                            </span>
                          </div>
                        )}
                        {day.pendingCount > 0 && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0056A3]/10">
                            <div className="w-2 h-2 rounded-full bg-[#0056A3]" />
                            <span className="text-xs font-bold text-[#0056A3]">
                              {day.pendingCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Appointments List */}
                    {day.bookings.length > 0 ? (
                      <>
                        <div className="space-y-2">
                          {displayBookings.map((booking, bookingIdx) => (
                            <button
                              key={bookingIdx}
                              onClick={() => setSelectedBooking(booking)}
                              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-sm transition-all hover:scale-[1.02] hover:shadow-md ${getStatusStyle(
                                booking.status
                              )}`}
                            >
                              <div
                                className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusDot(
                                  booking.status
                                )}`}
                              />

                              <div className="flex items-center gap-2 flex-shrink-0">
                                <Clock className="w-4 h-4 opacity-60" />
                                <span className="font-bold">
                                  {booking.time}
                                </span>
                              </div>

                              <div className="h-4 w-px bg-current opacity-20" />

                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <User className="w-4 h-4 opacity-60 flex-shrink-0" />
                                <span className="font-semibold truncate">
                                  {booking.name}
                                </span>
                              </div>

                              <div className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-white/50 text-xs font-medium truncate max-w-[150px] capitalize">
                                {booking.service}
                              </div>
                            </button>
                          ))}
                        </div>

                        {hasMoreThanTwo && (
                          <button
                            onClick={() => toggleDay(day.date)}
                            className="group/btn relative w-full mt-3 overflow-hidden transition-all duration-500"
                          >
                            <div className="relative px-4 py-2 bg-white border border-gray-200 rounded-xl transition-all duration-500 group-hover/btn:border-transparent group-hover/btn:shadow-lg">
                              <div className="absolute inset-0 bg-gradient-to-r from-[#0056A3]/10 to-[#009846]/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                              <div className="relative z-10 flex items-center justify-center gap-2">
                                {isExpanded ? (
                                  <>
                                    <ChevronUp className="w-4 h-4 text-gray-600 group-hover/btn:text-[#0056A3] transition-colors duration-500" />
                                    <span className="text-xs font-semibold text-gray-700 group-hover/btn:text-[#0056A3] transition-colors duration-500">
                                      Show less
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-4 h-4 text-gray-600 group-hover/btn:text-[#0056A3] transition-colors duration-500" />
                                    <span className="text-xs font-semibold text-gray-700 group-hover/btn:text-[#0056A3] transition-colors duration-500">
                                      Show {day.bookings.length - 2} more
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-400">
                          No appointments scheduled
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {upcomingData.totalUpcoming === 0 && (
            <div className="text-center py-8 mt-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">
                No upcoming appointments
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Schedule will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AnalyticsDashboard;
