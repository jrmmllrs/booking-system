import React, { useState } from "react";
import {
  Calendar,
  Archive,
  CheckCircle2,
  Clock,
  CheckCheck,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import BookingCard from "./BookingCard";

const ITEMS_PER_PAGE = 2;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const maxVisible = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            1
          </button>
          {startPage > 2 && <span className="text-gray-400">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
            currentPage === page
              ? "bg-[#0056A3] text-white border-[#0056A3]"
              : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="text-gray-400">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

const AdminBookingList = ({
  bookings,
  onCancel,
  onConfirm,
  onSetPending,
  onSetDone,
  onDelete,
  loading,
}) => {
  const [pendingPage, setPendingPage] = useState(1);
  const [confirmedPage, setConfirmedPage] = useState(1);
  const [donePage, setDonePage] = useState(1);
  const [cancelledPage, setCancelledPage] = useState(1);

  // Helper function to check if appointment is in the past
  const isAppointmentPast = (booking) => {
    const appointmentDateTime = new Date(`${booking.date} ${booking.time}`);
    const now = new Date();
    return appointmentDateTime < now;
  };

  // Further separate the filtered bookings by status and time
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending" && !isAppointmentPast(booking)
  );
  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed" && !isAppointmentPast(booking)
  );
  const doneBookings = bookings.filter(
    (booking) =>
      (booking.status === "pending" || booking.status === "confirmed") &&
      isAppointmentPast(booking)
  );
  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "cancelled"
  );

  // Pagination logic
  const getPaginatedItems = (items, page) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return items.slice(startIndex, endIndex);
  };

  const getTotalPages = (items) => Math.ceil(items.length / ITEMS_PER_PAGE);

  const paginatedPending = getPaginatedItems(pendingBookings, pendingPage);
  const paginatedConfirmed = getPaginatedItems(
    confirmedBookings,
    confirmedPage
  );
  const paginatedDone = getPaginatedItems(doneBookings, donePage);
  const paginatedCancelled = getPaginatedItems(
    cancelledBookings,
    cancelledPage
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
            {paginatedPending.map((booking) => (
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

          {getTotalPages(pendingBookings) > 1 && (
            <Pagination
              currentPage={pendingPage}
              totalPages={getTotalPages(pendingBookings)}
              onPageChange={setPendingPage}
            />
          )}
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
            {paginatedConfirmed.map((booking) => (
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

          {getTotalPages(confirmedBookings) > 1 && (
            <Pagination
              currentPage={confirmedPage}
              totalPages={getTotalPages(confirmedBookings)}
              onPageChange={setConfirmedPage}
            />
          )}
        </div>
      )}

      {/* Done Appointments Section */}
      {doneBookings.length > 0 && (
        <div>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h3 className="text-4xl font-light text-gray-900 tracking-tight mb-4 flex items-center gap-4">
                <CheckCheck className="w-9 h-9 text-emerald-600" />
                Done Appointments
              </h3>
              <div className="w-16 h-px bg-gradient-to-r from-emerald-600 to-transparent"></div>
            </div>
            <div className="text-sm text-gray-400 font-light tracking-widest uppercase">
              {doneBookings.length}{" "}
              {doneBookings.length === 1 ? "Completed" : "Completed"}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
              <div className="col-span-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                Name
              </div>
              <div className="col-span-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                Contact
              </div>
              <div className="col-span-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                Branch
              </div>
              <div className="col-span-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                Service
              </div>
              <div className="col-span-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                Date & Time
              </div>
              <div className="col-span-2 text-xs font-bold uppercase tracking-wider text-emerald-700 text-right">
                Actions
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-100">
              {paginatedDone.map((booking) => (
                <div
                  key={booking.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Name */}
                  <div className="col-span-2">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {booking.name}
                    </p>
                  </div>

                  {/* Contact */}
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 truncate">
                      {booking.email}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {booking.phone}
                    </p>
                  </div>

                  {/* Branch */}
                  <div className="col-span-2">
                    <p className="text-sm text-gray-700 font-medium">
                      {booking.branch === "villasis"
                        ? "Villasis"
                        : booking.branch === "carmen"
                        ? "Carmen, Rosales"
                        : booking.branch}
                    </p>
                  </div>

                  {/* Service */}
                  <div className="col-span-2">
                    <p className="text-sm text-gray-700 capitalize">
                      {booking.service}
                    </p>
                  </div>

                  {/* Date & Time */}
                  <div className="col-span-2">
                    <p className="text-sm text-gray-700 font-medium">
                      {booking.date}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {booking.time}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onDelete(booking.id);
                      }}
                      disabled={loading}
                      className="p-2 rounded-lg hover:bg-red-50 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {getTotalPages(doneBookings) > 1 && (
            <Pagination
              currentPage={donePage}
              totalPages={getTotalPages(doneBookings)}
              onPageChange={setDonePage}
            />
          )}
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
            {paginatedCancelled.map((booking) => (
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

          {getTotalPages(cancelledBookings) > 1 && (
            <Pagination
              currentPage={cancelledPage}
              totalPages={getTotalPages(cancelledBookings)}
              onPageChange={setCancelledPage}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AdminBookingList;
