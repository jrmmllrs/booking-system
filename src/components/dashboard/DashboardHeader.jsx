import React from "react";
import { User, LogOut } from "lucide-react";

const DashboardHeader = ({ user, onLogout }) => {
  return (
    <div className="w-full bg-white border-b border-gray-100 mb-8">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-br from-[#0056A3] to-[#009846]">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                Welcome back
              </h2>
              <p className="text-sm text-gray-500 font-normal">{user.email}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="group relative flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-500 hover:border-transparent hover:shadow-lg hover:shadow-[#0056A3]/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#0056A3] to-[#009846] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>

            <LogOut className="relative z-10 w-4 h-4 text-[#0056A3] group-hover:text-white transition-colors duration-500" />
            <span className="relative z-10 text-sm font-medium text-gray-700 group-hover:text-white transition-colors duration-500">
              Sign Out
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
