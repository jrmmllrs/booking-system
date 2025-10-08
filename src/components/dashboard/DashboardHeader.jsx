import React from "react";
import { User, LogOut } from "lucide-react";

const DashboardHeader = ({ user, onLogout }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Welcome back!</h2>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;