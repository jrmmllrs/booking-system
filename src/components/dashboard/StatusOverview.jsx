import React from "react";
import { Clock, CheckCircle2, XCircle, MessageSquare } from "lucide-react";

const StatusOverview = ({ bookingStats, contactStats }) => {
  const stats = [
    {
      label: "Pending",
      value: bookingStats.pending,
      icon: Clock,
      iconBg: "from-[#0056A3] to-[#0056A3]/80",
      textColor: "text-[#0056A3]",
    },
    {
      label: "Confirmed",
      value: bookingStats.confirmed,
      icon: CheckCircle2,
      iconBg: "from-[#009846] to-[#009846]/80",
      textColor: "text-[#009846]",
    },
    {
      label: "Cancelled",
      value: bookingStats.cancelled,
      icon: XCircle,
      iconBg: "from-gray-400 to-gray-500",
      textColor: "text-gray-500",
    },
    {
      label: "Messages",
      value: contactStats.unread,
      icon: MessageSquare,
      iconBg: "from-[#0056A3] to-[#009846]",
      textColor: "text-[#0056A3]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="group relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300 overflow-hidden"
        >
          <div className="relative p-6">
            {/* Icon */}
            <div className="flex items-center justify-between mb-6">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.iconBg} flex items-center justify-center shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Value */}
            <div className="space-y-1">
              <p className="text-4xl font-semibold text-gray-900 tracking-tight">
                {stat.value}
              </p>
              <p
                className={`text-sm font-medium tracking-wide ${stat.textColor} uppercase`}
              >
                {stat.label}
              </p>
            </div>
          </div>

          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      ))}
    </div>
  );
};

export default StatusOverview;
