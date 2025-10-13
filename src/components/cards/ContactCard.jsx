import React, { useState } from "react";
import {
  Mail,
  Trash2,
  Clock,
  X,
  FileText,
  User,
  Send,
  Eye,
  Calendar,
  Phone,
  MapPin,
  Briefcase,
} from "lucide-react";

const ContactCard = ({
  contact,
  onMarkAsRead,
  onDelete,
  onTransferToBooking,
}) => {
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  // Transfer to booking form state
  const [transferData, setTransferData] = useState({
    phone: "",
    service: "consultation",
    branch: "villasis",
    date: "",
    time: "",
    notes: "",
  });

  const emailTemplates = {
    general: `Dear ${contact.name},

Thank you for contacting us. We have received your message and will get back to you as soon as possible.

Best regards,
Diego Dental Clinic`,

    booking: `Dear ${contact.name},

Thank you for your booking inquiry! We have received your request and will confirm your appointment details shortly.

Best regards,
Diego Dental Clinic`,

    support: `Dear ${contact.name},

Thank you for reaching out. We're here to help and will respond to your inquiry soon.

Best regards,
Diego Dental Clinic`,
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatFullDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate();
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const convert24to12 = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleTemplateSelect = (templateKey) => {
    setSelectedTemplate(templateKey);
    setReplyMessage(templateKey ? emailTemplates[templateKey] : "");
  };

  const handleSendReply = () => {
    if (!replyMessage.trim()) return;

    const subject =
      selectedTemplate === "booking"
        ? "Booking Confirmation"
        : selectedTemplate === "support"
        ? "Support Response"
        : "Re: Your Message";

    const mailtoLink = `mailto:${contact.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(replyMessage)}`;
    window.location.href = mailtoLink;

    setTimeout(() => {
      if (contact.status === "unread") {
        onMarkAsRead(contact.id);
      }
      setShowReplyModal(false);
      setReplyMessage("");
      setSelectedTemplate("");
    }, 500);
  };

  const handleViewDetails = () => {
    setShowDetailsModal(true);
    // Auto-mark as read when viewing details
    if (contact.status === "unread") {
      setTimeout(() => {
        onMarkAsRead(contact.id);
      }, 300);
    }
  };

  const handleTransferSubmit = () => {
    if (!transferData.phone || !transferData.date || !transferData.time) {
      return;
    }

    const bookingData = {
      name: contact.name,
      email: contact.email,
      phone: transferData.phone,
      service: transferData.service,
      branch: transferData.branch,
      date: transferData.date,
      time: convert24to12(transferData.time),
      notes:
        transferData.notes ||
        `Transferred from contact inquiry: ${contact.message}`,
      contactId: contact.id,
    };

    onTransferToBooking(bookingData);

    // Reset form
    setShowTransferModal(false);
    setTransferData({
      phone: "",
      service: "consultation",
      branch: "villasis",
      date: "",
      time: "",
      notes: "",
    });
  };

  const resetTransferForm = () => {
    setShowTransferModal(false);
    setTransferData({
      phone: "",
      service: "consultation",
      branch: "villasis",
      date: "",
      time: "",
      notes: "",
    });
  };

  const isUnread = contact.status === "unread";
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <div
        className={`group relative bg-white rounded-2xl border transition-all duration-300 ${
          isUnread
            ? "border-[#0056A3]/20 hover:border-[#0056A3]/40 hover:shadow-xl hover:shadow-[#0056A3]/5"
            : "border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100"
        }`}
      >
        {/* Unread Indicator - Red Dot */}
        {isUnread && (
          <div className="absolute -top-2 -right-2 z-10">
            <div className="relative">
              <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
              <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>
        )}

        {/* Unread Indicator Bar */}
        {isUnread && (
          <div className="absolute -left-1 top-8 w-1 h-16 bg-gradient-to-b from-red-500 to-orange-500 rounded-r-full" />
        )}

        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-xl font-semibold text-gray-900 tracking-tight">
                  {contact.name}
                </h4>
                {isUnread && (
                  <span className="flex-shrink-0 text-xs font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
                    New
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm truncate">{contact.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={handleViewDetails}
                className="group/btn relative overflow-hidden transition-all duration-500"
                title="View Details"
              >
                <div className="relative p-2.5 bg-white border border-gray-200 rounded-xl transition-all duration-500 group-hover/btn:border-transparent group-hover/btn:shadow-lg group-hover/btn:shadow-[#0056A3]/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0056A3] to-[#0056A3]/80 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                  <Eye className="relative z-10 w-4 h-4 text-gray-600 group-hover/btn:text-white transition-colors duration-500" />
                </div>
              </button>

              <button
                onClick={() => setShowReplyModal(true)}
                className="group/btn relative overflow-hidden transition-all duration-500"
                title="Reply"
              >
                <div className="relative p-2.5 bg-white border border-gray-200 rounded-xl transition-all duration-500 group-hover/btn:border-transparent group-hover/btn:shadow-lg group-hover/btn:shadow-[#009846]/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#009846] to-[#009846]/80 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                  <Send className="relative z-10 w-4 h-4 text-gray-600 group-hover/btn:text-white transition-colors duration-500" />
                </div>
              </button>

              <button
                onClick={() => setShowTransferModal(true)}
                className="group/btn relative overflow-hidden transition-all duration-500"
                title="Transfer to Booking"
              >
                <div className="relative p-2.5 bg-white border border-gray-200 rounded-xl transition-all duration-500 group-hover/btn:border-transparent group-hover/btn:shadow-lg group-hover/btn:shadow-purple-500/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                  <Calendar className="relative z-10 w-4 h-4 text-gray-600 group-hover/btn:text-white transition-colors duration-500" />
                </div>
              </button>

              <button
                onClick={() => onDelete(contact.id)}
                className="group/btn relative overflow-hidden transition-all duration-500"
                title="Delete"
              >
                <div className="relative p-2.5 bg-white border border-gray-200 rounded-xl transition-all duration-500 group-hover/btn:border-transparent group-hover/btn:shadow-lg group-hover/btn:shadow-red-500/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                  <Trash2 className="relative z-10 w-4 h-4 text-gray-600 group-hover/btn:text-white transition-colors duration-500" />
                </div>
              </button>
            </div>
          </div>

          {/* Message Preview */}
          <div className="mb-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-[#0056A3]" />
              <p className="text-xs uppercase tracking-[0.1em] text-[#0056A3] font-bold">
                Message Preview
              </p>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
              {contact.message}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{formatDate(contact.createdAt)}</span>
            </div>
            <button
              onClick={handleViewDetails}
              className="text-sm font-semibold text-[#0056A3] hover:text-[#009846] transition-colors"
            >
              View full message
            </button>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {showDetailsModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-[#0056A3]/5 to-[#009846]/5">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="absolute right-6 top-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
                Message Details
              </h3>
              <p className="text-sm text-gray-500">
                Automatically marked as read
              </p>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-[#0056A3]/5 to-[#0056A3]/10 rounded-xl border border-[#0056A3]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-[#0056A3]" />
                    <p className="text-xs uppercase tracking-[0.1em] text-[#0056A3] font-bold">
                      Name
                    </p>
                  </div>
                  <p className="text-base text-gray-900 font-medium">
                    {contact.name}
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-br from-[#009846]/5 to-[#009846]/10 rounded-xl border border-[#009846]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-[#009846]" />
                    <p className="text-xs uppercase tracking-[0.1em] text-[#009846] font-bold">
                      Email
                    </p>
                  </div>
                  <p className="text-sm text-gray-900 font-medium break-all">
                    {contact.email}
                  </p>
                </div>
              </div>

              {/* Timestamp */}
              <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <p className="text-xs uppercase tracking-[0.1em] text-gray-600 font-bold">
                    Received On
                  </p>
                </div>
                <p className="text-base text-gray-900 font-medium">
                  {formatFullDate(contact.createdAt)}
                </p>
              </div>

              {/* Full Message */}
              <div className="p-6 bg-blue-50/50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-[#0056A3]" />
                  <p className="text-sm uppercase tracking-[0.1em] text-[#0056A3] font-bold">
                    Full Message
                  </p>
                </div>
                <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {contact.message}
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="group/btn relative overflow-hidden flex-1 transition-all duration-500"
              >
                <div className="relative px-6 py-3.5 bg-white border border-gray-200 rounded-xl transition-all duration-500 group-hover/btn:border-transparent group-hover/btn:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                  <span className="relative z-10 text-sm font-semibold tracking-wide text-gray-700 group-hover/btn:text-gray-900 transition-colors duration-500">
                    Close
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setShowReplyModal(true);
                }}
                className="group/btn relative overflow-hidden flex-1 transition-all duration-500"
              >
                <div className="relative px-6 py-3.5 bg-white border border-gray-200 rounded-xl transition-all duration-500 group-hover/btn:border-transparent group-hover/btn:shadow-lg group-hover/btn:shadow-[#009846]/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0056A3] to-[#009846] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    <Send className="w-4 h-4 text-[#0056A3] group-hover/btn:text-white transition-colors duration-500" />
                    <span className="text-sm font-semibold tracking-wide text-gray-700 group-hover/btn:text-white transition-colors duration-500">
                      Reply
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer to Booking Modal */}
      {showTransferModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={resetTransferForm}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
              <button
                onClick={resetTransferForm}
                className="absolute right-6 top-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
                Transfer to Booking
              </h3>
              <p className="text-sm text-gray-500">
                Convert this contact inquiry into a booking
              </p>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-220px)]">
              {/* Contact Info Display */}
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-purple-600" />
                  <p className="text-xs uppercase tracking-[0.1em] text-purple-600 font-bold">
                    Contact Information
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Name:</span> {contact.name}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Email:</span>{" "}
                    {contact.email}
                  </p>
                </div>
              </div>

              {/* Original Message */}
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-[#0056A3]" />
                  <p className="text-xs uppercase tracking-[0.1em] text-[#0056A3] font-bold">
                    Original Message
                  </p>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {contact.message}
                </p>
              </div>

              {/* Booking Form */}
              <div className="space-y-4">
                {/* Phone Number */}
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] text-gray-600 font-bold mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={transferData.phone}
                      onChange={(e) =>
                        setTransferData({
                          ...transferData,
                          phone: e.target.value,
                        })
                      }
                      placeholder="Enter phone number"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Branch */}
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] text-gray-600 font-bold mb-2">
                    Branch <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={transferData.branch}
                      onChange={(e) =>
                        setTransferData({
                          ...transferData,
                          branch: e.target.value,
                        })
                      }
                      className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm appearance-none"
                      required
                    >
                      <option value="villasis">Villasis, Pangasinan</option>
                      <option value="carmen">
                        Carmen, Rosales, Pangasinan
                      </option>
                    </select>
                  </div>
                </div>

                {/* Service */}
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] text-gray-600 font-bold mb-2">
                    Service <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={transferData.service}
                      onChange={(e) =>
                        setTransferData({
                          ...transferData,
                          service: e.target.value,
                        })
                      }
                      className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm appearance-none"
                      required
                    >
                      <option value="consultation">Consultation</option>
                      <option value="cleaning">Cleaning</option>
                      <option value="filling">Filling</option>
                      <option value="extraction">Extraction</option>
                      <option value="root-canal">Root Canal</option>
                      <option value="braces">Braces</option>
                      <option value="whitening">Whitening</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-gray-600 font-bold mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={transferData.date}
                      onChange={(e) =>
                        setTransferData({
                          ...transferData,
                          date: e.target.value,
                        })
                      }
                      min={today}
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-gray-600 font-bold mb-2">
                      Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={transferData.time}
                      onChange={(e) =>
                        setTransferData({
                          ...transferData,
                          time: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] text-gray-600 font-bold mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={transferData.notes}
                    onChange={(e) =>
                      setTransferData({
                        ...transferData,
                        notes: e.target.value,
                      })
                    }
                    rows="4"
                    placeholder="Add any additional notes for this booking..."
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex gap-3">
              <button
                onClick={resetTransferForm}
                className="group/btn relative overflow-hidden flex-1 transition-all duration-500"
              >
                <div className="relative px-6 py-3.5 bg-white border border-gray-200 rounded-xl transition-all duration-500 group-hover/btn:border-transparent group-hover/btn:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                  <span className="relative z-10 text-sm font-semibold tracking-wide text-gray-700 group-hover/btn:text-gray-900 transition-colors duration-500">
                    Cancel
                  </span>
                </div>
              </button>

              <button
                onClick={handleTransferSubmit}
                disabled={
                  !transferData.phone ||
                  !transferData.date ||
                  !transferData.time
                }
                className="group/btn relative overflow-hidden flex-1 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="relative px-6 py-3.5 bg-white border border-gray-200 rounded-xl transition-all duration-500 group-hover/btn:border-transparent group-hover/btn:shadow-lg group-hover/btn:shadow-purple-500/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600 group-hover/btn:text-white transition-colors duration-500" />
                    <span className="text-sm font-semibold tracking-wide text-gray-700 group-hover/btn:text-white transition-colors duration-500">
                      Confirm & Create Booking
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowReplyModal(false);
            setReplyMessage("");
            setSelectedTemplate("");
          }}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative px-8 py-6 border-b border-gray-100">
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyMessage("");
                  setSelectedTemplate("");
                }}
                className="absolute right-6 top-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
                Reply to Message
              </h3>
              <div className="flex items-center gap-2 text-gray-500">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{contact.email}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-220px)]">
              {/* Original Message */}
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-[#0056A3]" />
                  <p className="text-xs uppercase tracking-[0.1em] text-[#0056A3] font-bold">
                    Original Message from {contact.name}
                  </p>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {contact.message}
                </p>
              </div>

              {/* Template Selector */}
              <div>
                <label className="block text-xs uppercase tracking-[0.1em] text-gray-600 font-bold mb-3">
                  Quick Template
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { key: "", label: "Custom" },
                    { key: "general", label: "General" },
                    { key: "booking", label: "Booking" },
                    { key: "support", label: "Support" },
                  ].map((template) => (
                    <button
                      key={template.key}
                      type="button"
                      onClick={() => handleTemplateSelect(template.key)}
                      className={`relative overflow-hidden px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        selectedTemplate === template.key
                          ? "bg-gradient-to-br from-[#0056A3] to-[#009846] text-white shadow-lg"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {template.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reply Textarea */}
              <div>
                <label className="block text-xs uppercase tracking-[0.1em] text-gray-600 font-bold mb-3">
                  Your Reply
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows="10"
                  placeholder="Type your reply here..."
                  className="w-full px-4 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0056A3] focus:border-transparent resize-none text-sm transition-all leading-relaxed"
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyMessage("");
                  setSelectedTemplate("");
                }}
                className="group/btn relative overflow-hidden flex-1 transition-all duration-500"
              >
                <div className="relative px-6 py-3.5 bg-white border border-gray-200 rounded-xl transition-all duration-500 group-hover/btn:border-transparent group-hover/btn:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                  <span className="relative z-10 text-sm font-semibold tracking-wide text-gray-700 group-hover/btn:text-gray-900 transition-colors duration-500">
                    Cancel
                  </span>
                </div>
              </button>

              <button
                onClick={handleSendReply}
                disabled={!replyMessage.trim()}
                className="group/btn relative overflow-hidden flex-1 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="relative px-6 py-3.5 bg-white border border-gray-200 rounded-xl transition-all duration-500 group-hover/btn:border-transparent group-hover/btn:shadow-lg group-hover/btn:shadow-[#009846]/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0056A3] to-[#009846] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    <Send className="w-4 h-4 text-[#0056A3] group-hover/btn:text-white transition-colors duration-500" />
                    <span className="text-sm font-semibold tracking-wide text-gray-700 group-hover/btn:text-white transition-colors duration-500">
                      Send Reply
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactCard;
