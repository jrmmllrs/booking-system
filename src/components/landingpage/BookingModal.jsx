import React, { useState } from "react";
import { X } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase"; // ✅ make sure this path matches your setup

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
    date: "",
    time: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Generate time slots from 8:00 AM to 4:30 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 16; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 16 && minute > 30) break;
        const displayHour = hour > 12 ? hour - 12 : hour;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ Save appointment to Firebase (in "contacts" collection)
      await addDoc(collection(db, "contacts"), {
        name: formData.name,
        email: formData.email,
        message: `Booking Request\n\nService: ${formData.service}\nDate: ${formData.date}\nTime: ${formData.time}\nPhone: ${formData.phone}`,
        status: "unread",
        createdAt: serverTimestamp(),
        type: "booking", // optional: to differentiate from contact forms
      });

      // ✅ Notify parent component of success
      onSuccess(formData);

      // ✅ Close modal
      onClose();
    } catch (err) {
      console.error("Error submitting booking:", err);
      setError("Failed to submit booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              Book Appointment
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500"
              required
            />

            <select
              value={formData.service}
              onChange={(e) =>
                setFormData({ ...formData, service: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Service</option>
              {services.map((service, idx) => (
                <option key={idx} value={service}>
                  {service}
                </option>
              ))}
            </select>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Time (8:00 AM - 4:30 PM)
              </label>
              <select
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a time slot</option>
                {timeSlots.map((slot, idx) => (
                  <option key={idx} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0056A3] text-white py-3.5 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Confirm Appointment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
