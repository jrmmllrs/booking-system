import React from "react";
import { FileText } from "lucide-react";

export const MessagePreview = ({ message }) => (
  <div className="mb-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
    <div className="flex items-center gap-2 mb-2">
      <FileText className="w-4 h-4 text-[#0056A3]" />
      <p className="text-xs uppercase tracking-[0.1em] text-[#0056A3] font-bold">
        Message Preview
      </p>
    </div>
    <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
      {message}
    </p>
  </div>
);