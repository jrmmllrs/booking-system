import React from "react";
import { X, User, Mail, Clock, FileText, Send } from "lucide-react";
import { formatFullDate } from "../utils/dateFormatter";

export const DetailsModal = ({
  show,
  contact,
  onClose,
  onReply,
}) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-[#0056A3]/5 to-[#009846]/5">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
            Message Details
          </h3>
          <p className="text-sm text-gray-500">Automatically marked as read</p>
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
            onClick={onClose}
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
            onClick={onReply}
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
  );
};