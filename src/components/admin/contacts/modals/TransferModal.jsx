import React from "react";
import { X, User, FileText, Calendar } from "lucide-react";
import { BookingFormFields } from "./BookingFormFields";

export const TransferModal = ({
  show,
  contact,
  transferData,
  setTransferData,
  onClose,
  onSubmit,
}) => {
  if (!show) return null;

  const today = new Date().toISOString().split("T")[0];
  const isValid = transferData.phone && transferData.date && transferData.time;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
          <button
            onClick={onClose}
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
                <span className="font-semibold">Email:</span> {contact.email}
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
          <BookingFormFields
            transferData={transferData}
            setTransferData={setTransferData}
            today={today}
          />
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
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
            onClick={onSubmit}
            disabled={!isValid}
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
  );
};