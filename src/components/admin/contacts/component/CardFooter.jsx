import React from "react";
import { Clock } from "lucide-react";

export const CardFooter = ({ formattedDate, onViewDetails }) => (
  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Clock className="w-4 h-4" />
      <span>{formattedDate}</span>
    </div>
    <button
      onClick={onViewDetails}
      className="text-sm font-semibold text-[#0056A3] hover:text-[#009846] transition-colors"
    >
      View full message
    </button>
  </div>
);