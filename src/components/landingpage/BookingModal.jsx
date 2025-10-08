import React, { useState } from "react";
import { X } from "lucide-react";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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

          <div className="space-y-5">
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            <div>
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            <div>
              <select
                value={formData.service}
                onChange={(e) =>
                  setFormData({ ...formData, service: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-900"
                required
              >
                <option value="">Select Service</option>
                {services.map((service, idx) => (
                  <option key={idx} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-900"
                required
              />
              <input
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-900"
                required
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-medium hover:bg-blue-700 transition"
            >
              Confirm Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
