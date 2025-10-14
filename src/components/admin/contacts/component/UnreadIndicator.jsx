import React from "react";

export const UnreadIndicator = () => (
  <>
    <div className="absolute -top-2 -right-2 z-10">
      <div className="relative">
        <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
        <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75"></div>
      </div>
    </div>
    <div className="absolute -left-1 top-8 w-1 h-16 bg-gradient-to-b from-red-500 to-orange-500 rounded-r-full" />
  </>
);