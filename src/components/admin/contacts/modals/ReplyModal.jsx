import React from "react";
import { X, Mail, User, Send } from "lucide-react";

export default function ReplyModal({
  show,
  contact,
  replyMessage,
  setReplyMessage,
  selectedTemplate,
  setSelectedTemplate,
  onClose,
  onSend,
  handleTemplateSelect,
}) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => {
        onClose();
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
              onClose();
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
            <span className="text-sm">{contact?.email}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-220px)]">
          {/* Original Message */}
          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-[#0056A3]" />
              <p className="text-xs uppercase tracking-[0.1em] text-[#0056A3] font-bold">
                Original Message from {contact?.name}
              </p>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {contact?.message}
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
              onClose();
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
            onClick={onSend}
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
  );
}
