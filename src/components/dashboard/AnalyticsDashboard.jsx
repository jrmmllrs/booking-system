import React, { useMemo, useState } from "react";
import { Calendar, Clock, User, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

const AnalyticsDashboard = ({ bookings }) => {
  const [expandedDays, setExpandedDays] = useState({});

  const upcomingData = useMemo(() => {
    // Get next 7 days
    const today = new Date();
    const next7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      return date;
    });

    // Map bookings to days
    const calendarData = next7Days.map(date => {
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = date.toISOString().split('T')[0];
      const dayNum = date.getDate();
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      const dayBookings = bookings.filter(booking => {
        if (!booking.date || booking.status === 'cancelled') return false;
        const bookingDate = booking.date.includes('-') 
          ? booking.date 
          : new Date(booking.date).toISOString().split('T')[0];
        return bookingDate === dateStr;
      });

      // Sort by time
      dayBookings.sort((a, b) => {
        const timeA = a.time || '00:00';
        const timeB = b.time || '00:00';
        return timeA.localeCompare(timeB);
      });

      const isToday = dateStr === today.toISOString().split('T')[0];

      return {
        dayName,
        dayNum,
        monthName,
        date: dateStr,
        bookings: dayBookings,
        isToday,
        confirmedCount: dayBookings.filter(b => b.status === 'confirmed').length,
        pendingCount: dayBookings.filter(b => b.status === 'pending').length,
      };
    });

    const totalUpcoming = calendarData.reduce((sum, d) => sum + d.bookings.length, 0);
    const confirmedUpcoming = calendarData.reduce((sum, d) => sum + d.confirmedCount, 0);
    const pendingUpcoming = calendarData.reduce((sum, d) => sum + d.pendingCount, 0);

    return {
      calendarData,
      totalUpcoming,
      confirmedUpcoming,
      pendingUpcoming,
    };
  }, [bookings]);

  const toggleDay = (date) => {
    setExpandedDays(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusDot = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-emerald-500';
      case 'pending': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-gradient-to-br from-white via-white to-indigo-50/30 rounded-3xl shadow-xl p-8 border border-gray-200/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            Upcoming Appointments
          </h3>
          <p className="text-sm text-gray-500">Next 7 days</p>
        </div>
        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
          <Calendar className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl border border-indigo-200/50 text-center">
          <p className="text-2xl font-bold text-indigo-900">{upcomingData.totalUpcoming}</p>
          <p className="text-xs text-indigo-600 font-medium">Total</p>
        </div>
        <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200/50 text-center">
          <p className="text-2xl font-bold text-emerald-900">{upcomingData.confirmedUpcoming}</p>
          <p className="text-xs text-emerald-600 font-medium">Confirmed</p>
        </div>
        <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border border-amber-200/50 text-center">
          <p className="text-2xl font-bold text-amber-900">{upcomingData.pendingUpcoming}</p>
          <p className="text-xs text-amber-600 font-medium">Pending</p>
        </div>
      </div>

      {/* Compact Calendar */}
      <div className="space-y-2">
        {upcomingData.calendarData.map((day, idx) => {
          const isExpanded = expandedDays[day.date];
          const hasMoreThanTwo = day.bookings.length > 2;
          const displayBookings = isExpanded ? day.bookings : day.bookings.slice(0, 2);
          
          return (
            <div 
              key={idx}
              className={`rounded-xl border transition-all ${
                day.isToday 
                  ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="p-3">
                {/* Compact Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`text-center ${day.isToday ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-gray-100 text-gray-700'} rounded-lg p-1.5 min-w-[50px]`}>
                      <p className="text-xs font-medium">{day.dayName}</p>
                      <p className="text-base font-bold">{day.dayNum}</p>
                    </div>
                    {day.isToday && (
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                        Today
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">
                      {day.bookings.length}
                    </span>
                    {day.confirmedCount > 0 && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-xs text-emerald-600 font-medium">{day.confirmedCount}</span>
                      </div>
                    )}
                    {day.pendingCount > 0 && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-xs text-amber-600 font-medium">{day.pendingCount}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Appointments */}
                {day.bookings.length > 0 ? (
                  <>
                    <div className="space-y-1.5">
                      {displayBookings.map((booking, bookingIdx) => (
                        <div 
                          key={bookingIdx}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-xs ${getStatusColor(booking.status)}`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${getStatusDot(booking.status)}`} />
                          <Clock className="w-3.5 h-3.5 opacity-60" />
                          <span className="font-semibold">{booking.time}</span>
                          <span className="font-medium flex-1 truncate">{booking.name}</span>
                          <span className="opacity-75 truncate max-w-[100px]">{booking.service}</span>
                        </div>
                      ))}
                    </div>
                    
                    {hasMoreThanTwo && (
                      <button
                        onClick={() => toggleDay(day.date)}
                        className="w-full mt-2 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5" />
                            Show less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5" />
                            +{day.bookings.length - 2} more
                          </>
                        )}
                      </button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-xs text-gray-400">No appointments</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {upcomingData.totalUpcoming === 0 && (
        <div className="text-center py-6 mt-4">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No upcoming appointments</p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;