// src/components/admin/ContactCard.jsx
import React, { useState } from "react";
import { Eye, Trash2, Mail, X } from "lucide-react";

const ContactCard = ({ contact, onMarkAsRead, onDelete }) => {
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [sending, setSending] = useState(false);

  const emailTemplates = {
    general: {
      subject: "Re: Your Inquiry",
      body: `Dear ${contact.name},

Thank you for contacting us. We have received your message and appreciate you reaching out.

We will review your inquiry and get back to you as soon as possible.

Best regards,
HomeSerBase Team`,
    },
    booking: {
      subject: "Booking Confirmation",
      body: `Dear ${contact.name},

Thank you for your interest in booking with us!

We have received your inquiry and our team will contact you shortly to confirm your appointment details.

If you have any urgent questions, please don't hesitate to reach out.

Best regards,
HomeSerBase Team`,
    },
    support: {
      subject: "Support Response",
      body: `Dear ${contact.name},

Thank you for contacting our support team.

We understand your concern and are here to help. Our team is reviewing your message and will provide you with a solution shortly.

Best regards,
HomeSerBase Support Team`,
    },
    thankyou: {
      subject: "Thank You",
      body: `Dear ${contact.name},

Thank you so much for your message!

We truly appreciate you taking the time to reach out to us. Your feedback and inquiries help us improve our services.

Best regards,
HomeSerBase Team`,
    },
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate();
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const handleTemplateSelect = (templateKey) => {
    setSelectedTemplate(templateKey);
    if (templateKey) {
      const template = emailTemplates[templateKey];
      setReplyMessage(template.body);
    } else {
      setReplyMessage("");
    }
  };

  const handleSendReply = () => {
    if (!replyMessage.trim()) {
      alert("Please enter a message");
      return;
    }

    setSending(true);

    const template = selectedTemplate ? emailTemplates[selectedTemplate] : null;
    const subject = template ? template.subject : "Re: Your Message";

    // Create mailto link with pre-filled content
    const mailtoLink = `mailto:${contact.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(replyMessage)}`;

    // Open default email client
    window.location.href = mailtoLink;

    // Mark as read after sending
    setTimeout(() => {
      if (contact.status === "unread") {
        onMarkAsRead(contact.id);
      }
      setSending(false);
      setShowReplyModal(false);
      setReplyMessage("");
      setSelectedTemplate("");
    }, 1000);
  };

  return (
    <>
      <div
        className={`border rounded-xl p-6 transition-all ${
          contact.status === "unread"
            ? "bg-blue-50 border-blue-200"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-lg font-semibold text-gray-800">
                {contact.name}
              </h4>
              {contact.status === "unread" && (
                <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                  New
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">{contact.email}</p>
            <p className="text-xs text-gray-500 mt-1">
              {formatDate(contact.createdAt)}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowReplyModal(true)}
              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
              title="Reply via email"
            >
              <Mail className="w-5 h-5" />
            </button>
            {contact.status === "unread" && (
              <button
                onClick={() => onMarkAsRead(contact.id)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                title="Mark as read"
              >
                <Eye className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => onDelete(contact.id)}
              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Reply to {contact.name}
                </h3>
                <p className="text-sm text-gray-600">{contact.email}</p>
              </div>
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyMessage("");
                  setSelectedTemplate("");
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Original Message */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Original Message:</p>
                <p className="text-sm text-gray-700">{contact.message}</p>
              </div>

              {/* Template Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Template (Optional)
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">-- Custom Reply --</option>
                  <option value="general">General Response</option>
                  <option value="booking">Booking Inquiry</option>
                  <option value="support">Support Response</option>
                  <option value="thankyou">Thank You</option>
                </select>
              </div>

              {/* Reply Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Reply
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows="10"
                  placeholder="Type your reply here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                ></textarea>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleSendReply}
                  disabled={sending || !replyMessage.trim()}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      <span>Send Reply</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setReplyMessage("");
                    setSelectedTemplate("");
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactCard;
