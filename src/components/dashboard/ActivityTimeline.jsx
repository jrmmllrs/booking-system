// src/components/dashboard/ActivityTimeline.jsx
import React from "react";
import { Clock, Calendar, Mail, CheckCircle, XCircle } from "lucide-react";

const ActivityTimeline = ({ bookings, contacts }) => {
  const getRecentActivity = () => {
    const activities = [];

    // Add recent bookings with null checks
    bookings.slice(0, 5).forEach((booking) => {
      if (booking && booking.createdAt) {
        activities.push({
          type: "booking",
          status: booking.status,
          name: booking.name || "Unknown",
          service: booking.service || "Unknown Service",
          branch: booking.branch || "Unknown Branch",
          timestamp: booking.createdAt,
        });
      }
    });

    // Add recent contacts with null checks
    contacts.slice(0, 3).forEach((contact) => {
      if (contact && contact.createdAt) {
        activities.push({
          type: "contact",
          status: contact.status,
          name: contact.name || "Unknown",
          email: contact.email || "No email",
          timestamp: contact.createdAt,
        });
      }
    });

    // Sort by timestamp (most recent first)
    return activities
      .sort((a, b) => {
        const timeA = a.timestamp?.seconds || 0;
        const timeB = b.timestamp?.seconds || 0;
        return timeB - timeA;
      })
      .slice(0, 8);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return "Unknown time";

    const date = new Date(timestamp.seconds * 1000);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getActivityIcon = (activity) => {
    if (activity.type === "contact") {
      return <Mail className="w-4 h-4 text-blue-600" />;
    }
    switch (activity.status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Calendar className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getActivityColor = (activity) => {
    if (activity.type === "contact") return "bg-blue-100";
    switch (activity.status) {
      case "confirmed":
        return "bg-green-100";
      case "cancelled":
        return "bg-red-100";
      default:
        return "bg-yellow-100";
    }
  };

  const recentActivities = getRecentActivity();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-300 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
      </div>

      <div className="space-y-4">
        {recentActivities.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            No recent activity
          </p>
        ) : (
          recentActivities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div
                className={`w-8 h-8 ${getActivityColor(
                  activity
                )} rounded-lg flex items-center justify-center flex-shrink-0`}
              >
                {getActivityIcon(activity)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {activity.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {activity.type === "contact"
                    ? `New message from ${activity.email}`
                    : `${activity.service} - ${activity.branch}`}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatTimestamp(activity.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;
