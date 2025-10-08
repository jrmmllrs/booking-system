// src/components/dashboard/ActivityTimeline.jsx
import React from "react";
import { Clock, Calendar, Mail } from "lucide-react";

const ActivityTimeline = ({ bookings, contacts }) => {
  const getRecentActivity = () => {
    const bookingActivities = bookings.slice(0, 3).map(b => ({
      type: 'booking',
      title: `New booking from ${b.name}`,
      subtitle: `${b.service} - ${b.date}`,
      time: 'Recently',
      icon: Calendar,
      color: 'indigo'
    }));

    const contactActivities = contacts.slice(0, 2).map(c => ({
      type: 'contact',
      title: `Message from ${c.name}`,
      subtitle: c.message.substring(0, 40) + '...',
      time: 'Recently',
      icon: Mail,
      color: 'purple'
    }));

    return [...bookingActivities, ...contactActivities].slice(0, 5);
  };

  const activities = getRecentActivity();

  const colorClasses = {
    indigo: 'from-indigo-500 to-indigo-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <div className="bg-gradient-to-br from-white via-white to-gray-50/30 rounded-3xl shadow-xl p-6 border border-gray-200/50">
      <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
        <Clock className="w-5 h-5 text-indigo-600" />
        Recent Activity
      </h3>

      <div className="space-y-4">
        {activities.map((activity, idx) => (
          <div key={idx} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-200 group">
            <div className={`p-2.5 bg-gradient-to-br ${colorClasses[activity.color]} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200`}>
              <activity.icon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 mb-0.5">{activity.title}</p>
              <p className="text-xs text-gray-600 truncate">{activity.subtitle}</p>
              <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTimeline;