import React from "react";
import { User, LogOut } from "lucide-react";

const DashboardHeader = ({ user, onLogout }) => {
  return (
    <div className="w-full mb-8">
      <div className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden">
        {/* Elegant gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0056A3]/10 via-[#009846]/5 to-white p-px rounded-2xl">
          <div className="h-full w-full bg-white rounded-2xl"></div>
        </div>

        <div className="relative p-6">
          <div className="flex justify-between items-center">
            {/* User info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#0056A3] shadow-sm">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 tracking-tight mb-0.5">
                  Welcome back
                </h2>
                <p className="text-xs text-gray-500 font-medium">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Sign out button */}
            <button
              onClick={onLogout}
              className="group relative flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-widest uppercase rounded-xl overflow-hidden transition-all duration-300"
            >
              {/* Border layer */}
              <span className="absolute inset-0 bg-gradient-to-br from-[#0056A3]/10 via-[#009846]/10 to-white p-px rounded-xl">
                <span className="block h-full w-full bg-white rounded-xl group-hover:bg-gradient-to-br group-hover:from-[#0056A3]/5 group-hover:to-[#009846]/5 transition-all duration-300"></span>
              </span>

              {/* Icon and text */}
              <LogOut className="relative z-10 w-3.5 h-3.5 text-[#0056A3] group-hover:text-white transition-colors duration-300" />
              <span className="relative z-10 text-[#0056A3] group-hover:text-white transition-colors duration-300">
                Sign Out
              </span>

              {/* Gradient hover fill */}
              <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#0056A3] to-[#009846] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;