import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Briefcase,
  User,
  Mail,
  Phone,
  Check,
} from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";

export default function BookingModal({
  onClose = () => {},
  onSuccess = () => {},
  services = [],
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    branch: "",
    date: "",
    time: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const selectedDate = formData.date
      ? new Date(formData.date + "T00:00:00")
      : null;
    const isToday =
      selectedDate && selectedDate.toDateString() === now.toDateString();

    for (let hour = 8; hour <= 16; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 16 && minute > 30) break;

        // Check if time slot is in the past for today
        if (isToday) {
          const slotTime = new Date();
          slotTime.setHours(hour, minute, 0, 0);
          if (slotTime <= now) {
            continue; // Skip past time slots
          }
        }

        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const period = hour >= 12 ? "PM" : "AM";
        const minuteStr = minute.toString().padStart(2, "0");
        slots.push({
          value: `${hour.toString().padStart(2, "0")}:${minuteStr}`,
          label: `${displayHour}:${minuteStr} ${period}`,
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleClose = () => {
    if (loading) return;
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await addDoc(collection(db, "contacts"), {
        name: formData.name,
        email: formData.email,
        message: `Booking Request\n\nService: ${formData.service}\nBranch: ${formData.branch}\nDate: ${formData.date}\nTime: ${formData.time}\nPhone: ${formData.phone}`,
        status: "unread",
        createdAt: serverTimestamp(),
        type: "booking",
      });

      setSubmitted(true);
      onSuccess(formData);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      console.error("Error submitting booking:", err);
      setError("Failed to submit booking. Please try again.");
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        className={`fixed inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-12 text-center transform transition-all duration-500 scale-100">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Check className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Booking Confirmed!
          </h3>
          <p className="text-gray-600">
            Your appointment has been successfully scheduled. We'll send you a
            confirmation email shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden transition-all duration-500 ${
          isVisible
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-8"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-[#0056A3] to-[#0070CC] p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>

          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Book Your Visit
              </h2>
              <p className="text-blue-100 text-sm">
                Schedule an appointment with us
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110 disabled:opacity-50"
            >
              <X className="w-7 h-7" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg animate-shake">
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="relative group">
              <User
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                  focusedField === "name" ? "text-[#0056A3]" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#0056A3] transition-all duration-300 outline-none"
                required
              />
            </div>

            {/* Email */}
            <div className="relative group">
              <Mail
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                  focusedField === "email" ? "text-[#0056A3]" : "text-gray-400"
                }`}
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#0056A3] transition-all duration-300 outline-none"
                required
              />
            </div>

            {/* Phone */}
            <div className="relative group">
              <Phone
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                  focusedField === "phone" ? "text-[#0056A3]" : "text-gray-400"
                }`}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                onFocus={() => setFocusedField("phone")}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#0056A3] transition-all duration-300 outline-none"
                required
              />
            </div>

            {/* Branch Selection */}
            <div className="relative group">
              <MapPin
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                  focusedField === "branch" ? "text-[#0056A3]" : "text-gray-400"
                }`}
              />
              <select
                value={formData.branch}
                onChange={(e) =>
                  setFormData({ ...formData, branch: e.target.value })
                }
                onFocus={() => setFocusedField("branch")}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#0056A3] transition-all duration-300 outline-none appearance-none cursor-pointer"
                required
              >
                <option value="">Select Branch Location</option>
                <option value="Villasis, Pangasinan">
                  Villasis, Pangasinan
                </option>
                <option value="Carmen, Rosales, Pangasinan">
                  Carmen, Rosales, Pangasinan
                </option>
              </select>
            </div>

            {/* Service Selection */}
            <div className="relative group">
              <Briefcase
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                  focusedField === "service"
                    ? "text-[#0056A3]"
                    : "text-gray-400"
                }`}
              />
              <select
                value={formData.service}
                onChange={(e) =>
                  setFormData({ ...formData, service: e.target.value })
                }
                onFocus={() => setFocusedField("service")}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#0056A3] transition-all duration-300 outline-none appearance-none cursor-pointer"
                required
              >
                <option value="">Select Service Type</option>
                {services.map((service, idx) => (
                  <option key={idx} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div className="relative group">
              <Calendar
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                  focusedField === "date" ? "text-[#0056A3]" : "text-gray-400"
                }`}
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value, time: "" })
                }
                onFocus={() => setFocusedField("date")}
                onBlur={() => setFocusedField(null)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#0056A3] transition-all duration-300 outline-none cursor-pointer"
                required
              />
            </div>

            {/* Time Selection */}
            <div className="relative group">
              <Clock
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                  focusedField === "time" ? "text-[#0056A3]" : "text-gray-400"
                }`}
              />
              <select
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                onFocus={() => setFocusedField("time")}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#0056A3] transition-all duration-300 outline-none appearance-none cursor-pointer"
                required
                disabled={!formData.date}
              >
                <option value="">
                  {!formData.date
                    ? "Select a date first"
                    : timeSlots.length === 0
                    ? "No available times today"
                    : "Choose available time"}
                </option>
                {timeSlots.map((slot, idx) => (
                  <option key={idx} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>

            {timeSlots.length === 0 && formData.date && (
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-xl">
                No time slots available for today. Please select a future date.
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || (formData.date && timeSlots.length === 0)}
              className="w-full bg-gradient-to-r from-[#0056A3] to-[#0070CC] text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transform mt-6 relative overflow-hidden group"
            >
              <span className="relative z-10">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Confirm Appointment"
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#0070CC] to-[#0056A3] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
