import React from "react";
import { Mail, Eye, Send, Calendar, Trash2 } from "lucide-react";

const IconButton = ({ onClick, title, icon: Icon, colorClass }) => (
  <button
    onClick={onClick}
    className="group/btn relative overflow-hidden transition-all duration-500"
    title={title}
  >
    <div
      className={`relative p-2.5 bg-white border border-gray-200 rounded-xl transition-all duration-500 group-hover/btn:border-transparent group-hover/btn:shadow-lg group-hover/btn:shadow-${colorClass}/10`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl ${colorClass}`}
      ></div>
      <Icon className="relative z-10 w-4 h-4 text-gray-600 group-hover/btn:text-white transition-colors duration-500" />
    </div>
  </button>
);

export const CardHeader = ({
  contact,
  isUnread,
  onViewDetails,
  onReply,
  onTransfer,
  onDelete,
}) => (
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
      <IconButton
        onClick={onViewDetails}
        title="View Details"
        icon={Eye}
        colorClass="from-[#0056A3] to-[#0056A3]/80"
      />
      <IconButton
        onClick={onReply}
        title="Reply"
        icon={Send}
        colorClass="from-[#009846] to-[#009846]/80"
      />
      <IconButton
        onClick={onTransfer}
        title="Transfer to Booking"
        icon={Calendar}
        colorClass="from-purple-500 to-purple-600"
      />
      <IconButton
        onClick={onDelete}
        title="Delete"
        icon={Trash2}
        colorClass="from-red-500 to-red-600"
      />
    </div>
  </div>
);