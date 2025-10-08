// src/components/dashboard/StatusOverview.jsx
import React from "react";
import { Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const StatusOverview = ({ bookingStats, contactStats }) => {
  const stats = [
    {
      label: "Pending",
      value: bookingStats.pending,
      icon: Clock,
      color: "amber",
      gradient: "from-amber-500 to-amber-600",
      bg: "from-amber-50 to-amber-100/50",
      border: "border-amber-200/50",
    },
    {
      label: "Confirmed",
      value: bookingStats.confirmed,
      icon: CheckCircle2,
      color: "emerald",
      gradient: "from-emerald-500 to-emerald-600",
      bg: "from-emerald-50 to-emerald-100/50",
      border: "border-emerald-200/50",
    },
    {
      label: "Cancelled",
      value: bookingStats.cancelled,
      icon: XCircle,
      color: "rose",
      gradient: "from-rose-500 to-rose-600",
      bg: "from-rose-50 to-rose-100/50",
      border: "border-rose-200/50",
    },
    {
      label: "Unread Msgs",
      value: contactStats.unread,
      icon: AlertCircle,
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
      bg: "from-blue-50 to-blue-100/50",
      border: "border-blue-200/50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`bg-gradient-to-br ${stat.bg} rounded-2xl p-6 border ${stat.border} hover:shadow-lg transition-all duration-300 group`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200`}
            >
              <stat.icon className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
          <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatusOverview;
