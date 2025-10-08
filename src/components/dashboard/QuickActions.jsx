// src/components/dashboard/QuickActions.jsx
import React from "react";
import { TrendingUp, Download, Clock } from "lucide-react";

const QuickActions = ({ onExport, onRefresh, bookingsCount, contactsCount }) => {
  return (
    <div className="bg-gradient-to-br from-white via-white to-purple-50/30 rounded-3xl shadow-xl p-6 border border-gray-200/50">
      <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-indigo-600" />
        Quick Actions
      </h3>
      
      <div className="space-y-3">
        <button
          onClick={onExport}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
        >
          <span className="flex items-center gap-3">
            <Download className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-semibold">Export Data</span>
          </span>
          <span className="text-indigo-200 text-sm">CSV</span>
        </button>

        <button
          onClick={onRefresh}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
        >
          <span className="flex items-center gap-3">
            <Clock className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            <span className="font-semibold">Refresh Data</span>
          </span>
        </button>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200/50">
          <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50">
            <p className="text-xs text-blue-700 font-medium mb-1">Bookings</p>
            <p className="text-xl font-bold text-blue-900">{bookingsCount}</p>
          </div>
          <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200/50">
            <p className="text-xs text-purple-700 font-medium mb-1">Messages</p>
            <p className="text-xl font-bold text-purple-900">{contactsCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;