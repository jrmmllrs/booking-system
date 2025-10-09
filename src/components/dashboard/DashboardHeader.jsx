import React from "react";
import { User, LogOut } from "lucide-react";

const DashboardHeader = ({ user, onLogout }) => {
  return (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="relative bg-gradient-to-br from-blue-50 to-white rounded-2xl overflow-hidden">
        {/* Elegant border effect with blue accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-blue-100 to-white p-px rounded-2xl">
          <div className="h-full w-full bg-white rounded-2xl"></div>
        </div>
        
        <div className="relative p-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 border-2 border-blue-300 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm">
                <User className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-2xl font-light text-gray-900 tracking-tight mb-1">
                  Welcome back
                </h2>
                <p className="text-sm text-blue-600 font-light tracking-wide">{user.email}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-5 py-2.5 text-xs text-blue-600 font-light uppercase tracking-widest border-2 border-blue-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// New Booking Button Component
export const NewBookingButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 text-xs text-blue-600 font-light tracking-widest uppercase border-2 border-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-300 mb-12 max-w-4xl mx-auto block shadow-sm hover:shadow-lg"
    >
      + New Booking
    </button>
  );
};

export default DashboardHeader;