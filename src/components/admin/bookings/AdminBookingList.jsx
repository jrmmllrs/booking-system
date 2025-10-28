import React, { useState } from "react";
import {
  Calendar,
  Archive,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
} from "lucide-react";

const ITEMS_PER_PAGE = 8;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
            currentPage === page
              ? "bg-blue-600 text-white border-blue-600"
              : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      ))}

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

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      label: "Pending",
      icon: Clock,
    },
    confirmed: {
      color: "bg-green-100 text-green-800 border-green-200",
      label: "Confirmed",
      icon: CheckCircle2,
    },
    cancelled: {
      color: "bg-red-100 text-red-800 border-red-200",
      label: "Cancelled",
      icon: Archive,
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}
    >
      <IconComponent className="w-3 h-3" />
      {config.label}
    </span>
  );
};

const BookingCard = ({
  booking,
  onCancel,
  onConfirm,
  onSetPending,
  onDelete,
  loading,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const getBranchName = (branch) => {
    const branches = {
      villasis: "Villasis, Pangasinan",
      carmen: "Carmen, Rosales",
    };
    return branches[branch] || branch;
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    setShowActions(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-all">
      {/* Header - Always Visible */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 text-sm truncate">
                {booking.name}
              </h3>
              <StatusBadge status={booking.status} />
            </div>
            <p className="text-xs text-gray-500 truncate">{booking.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleExpand}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              disabled={loading}
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>

            {showActions && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]">
                {booking.status === "pending" && (
                  <button
                    onClick={() => {
                      onConfirm(booking.id);
                      setShowActions(false);
                    }}
                    disabled={loading}
                    className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50"
                  >
                    Confirm
                  </button>
                )}
                {booking.status === "confirmed" && (
                  <button
                    onClick={() => {
                      onSetPending(booking.id);
                      setShowActions(false);
                    }}
                    disabled={loading}
                    className="w-full text-left px-3 py-2 text-sm text-yellow-600 hover:bg-yellow-50 transition-colors disabled:opacity-50"
                  >
                    Set Pending
                  </button>
                )}
                <button
                  onClick={() => {
                    const reason = window.prompt("Cancellation reason:");
                    if (reason) {
                      onCancel(booking.id, reason);
                    }
                    setShowActions(false);
                  }}
                  disabled={loading}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this booking?"
                      )
                    ) {
                      onDelete(booking.id);
                    }
                    setShowActions(false);
                  }}
                  disabled={loading}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 text-xs font-medium">Phone:</span>
              <p className="font-medium mt-1">{booking.phone || "N/A"}</p>
            </div>
            <div>
              <span className="text-gray-500 text-xs font-medium">Branch:</span>
              <p className="font-medium mt-1">
                {getBranchName(booking.branch)}
              </p>
            </div>
            <div>
              <span className="text-gray-500 text-xs font-medium">
                Service:
              </span>
              <p className="font-medium mt-1 capitalize">{booking.service}</p>
            </div>
            <div>
              <span className="text-gray-500 text-xs font-medium">
                Date & Time:
              </span>
              <p className="font-medium mt-1">
                {booking.date} at {booking.time}
              </p>
            </div>
          </div>

          {booking.notes && (
            <div>
              <span className="text-gray-500 text-xs font-medium">Notes:</span>
              <p className="text-sm text-gray-700 mt-1">{booking.notes}</p>
            </div>
          )}

          {booking.cancellationReason && (
            <div>
              <span className="text-gray-500 text-xs font-medium">
                Cancellation Reason:
              </span>
              <p className="text-sm text-red-600 mt-1">
                {booking.cancellationReason}
              </p>
            </div>
          )}

          <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
            Created:{" "}
            {booking.createdAt?.toDate?.().toLocaleDateString() || "N/A"}
          </div>
        </div>
      )}
    </div>
  );
};

const AdminBookingList = ({
  bookings,
  onCancel,
  onConfirm,
  onSetPending,
  onDelete,
  loading,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter bookings by status and search
  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    const matchesSearch =
      searchTerm === "" ||
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBookings = filteredBookings.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Status counts
  const statusCounts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500">Loading bookings...</p>
      </div>
    );
  }

  if (bookings.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No bookings found</p>
        <p className="text-gray-400 text-sm mt-2">
          All bookings will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto">
            {[
              { key: "all", label: "All", count: statusCounts.all },
              { key: "pending", label: "Pending", count: statusCounts.pending },
              {
                key: "confirmed",
                label: "Confirmed",
                count: statusCounts.confirmed,
              },
              {
                key: "cancelled",
                label: "Cancelled",
                count: statusCounts.cancelled,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setStatusFilter(tab.key);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  statusFilter === tab.key
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-xs ${
                    statusFilter === tab.key
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {paginatedBookings.length} of {filteredBookings.length}{" "}
          bookings
          {searchTerm && ` for "${searchTerm}"`}
          {statusFilter !== "all" && ` (${statusFilter})`}
        </p>
        {(searchTerm || statusFilter !== "all") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setCurrentPage(1);
            }}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {paginatedBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onCancel={onCancel}
            onConfirm={onConfirm}
            onSetPending={onSetPending}
            onDelete={onDelete}
            loading={loading}
          />
        ))}
      </div>

      {/* No Results */}
      {paginatedBookings.length === 0 && !loading && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No bookings match your filters</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setCurrentPage(1);
            }}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default AdminBookingList;
