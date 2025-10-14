import React, { useState } from "react";
import { UnreadIndicator } from "./component/UnreadIndicator";
import { CardHeader } from "./component/CardHeader";
import { MessagePreview } from "./component/MessagePreview";
import { CardFooter } from "./component/CardFooter";
import { DetailsModal } from "./modals/DetailsModal";
import { TransferModal } from "./modals/TransferModal";
import ReplyModal from "./modals/ReplyModal";
import { getEmailTemplates, getEmailSubject } from "./utils/emailTemplates";
import {
  formatDate,
  formatFullDate,
  convert24to12,
} from "./utils/dateFormatter";

import {
  createBookingData,
  getInitialTransferData,
} from "./utils/bookingHandler";

const ContactCard = ({
  contact,
  onMarkAsRead,
  onDelete,
  onTransferToBooking,
}) => {
  // Modal state
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Reply state
  const [replyMessage, setReplyMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  // Transfer state
  const [transferData, setTransferData] = useState(getInitialTransferData());

  const isUnread = contact.status === "unread";
  const emailTemplates = getEmailTemplates(contact.name);

  // Handlers
  const handleViewDetails = () => {
    setShowDetailsModal(true);
    if (isUnread) {
      setTimeout(() => onMarkAsRead(contact.id), 300);
    }
  };

  const handleSendReply = () => {
    if (!replyMessage.trim()) return;

    const subject = getEmailSubject(selectedTemplate);
    const mailtoLink = `mailto:${contact.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(replyMessage)}`;

    window.location.href = mailtoLink;

    setTimeout(() => {
      if (isUnread) {
        onMarkAsRead(contact.id);
      }
      setShowReplyModal(false);
      setReplyMessage("");
      setSelectedTemplate("");
    }, 500);
  };

  const handleTemplateSelect = (templateKey) => {
    setSelectedTemplate(templateKey);
    setReplyMessage(templateKey ? emailTemplates[templateKey] : "");
  };

  const handleTransferSubmit = () => {
    if (!transferData.phone || !transferData.date || !transferData.time) return;

    const bookingData = createBookingData(contact, transferData, convert24to12);
    onTransferToBooking(bookingData);

    setShowTransferModal(false);
    setTransferData(getInitialTransferData());
  };

  const handleCloseTransferModal = () => {
    setShowTransferModal(false);
    setTransferData(getInitialTransferData());
  };

  return (
    <>
      <div
        className={`group relative bg-white rounded-2xl border transition-all duration-300 ${
          isUnread
            ? "border-[#0056A3]/20 hover:border-[#0056A3]/40 hover:shadow-xl hover:shadow-[#0056A3]/5"
            : "border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100"
        }`}
      >
        {isUnread && <UnreadIndicator />}

        <div className="p-8">
          <CardHeader
            contact={contact}
            isUnread={isUnread}
            onViewDetails={handleViewDetails}
            onReply={() => setShowReplyModal(true)}
            onTransfer={() => setShowTransferModal(true)}
            onDelete={() => onDelete(contact.id)}
          />
          <MessagePreview message={contact.message} />
          <CardFooter
            formattedDate={formatDate(contact.createdAt)}
            onViewDetails={handleViewDetails}
          />
        </div>
      </div>

      {/* Modals */}
      <DetailsModal
        show={showDetailsModal}
        contact={contact}
        onClose={() => setShowDetailsModal(false)}
        onReply={() => {
          setShowDetailsModal(false);
          setShowReplyModal(true);
        }}
      />

      <TransferModal
        show={showTransferModal}
        contact={contact}
        transferData={transferData}
        setTransferData={setTransferData}
        onClose={handleCloseTransferModal}
        onSubmit={handleTransferSubmit}
      />

      <ReplyModal
        show={showReplyModal}
        contact={contact}
        replyMessage={replyMessage}
        setReplyMessage={setReplyMessage}
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
        onClose={() => setShowReplyModal(false)}
        onSend={handleSendReply}
        handleTemplateSelect={handleTemplateSelect}
        emailTemplates={emailTemplates}
      />
    </>
  );
};

export default ContactCard;
