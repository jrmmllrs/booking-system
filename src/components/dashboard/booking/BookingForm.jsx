import React, { useState } from "react";
import { XCircle, Calendar, Clock, FileText } from "lucide-react";
import PersonalInfoSection from "../booking/PersonalInfoSection";
import ServiceSelector from "../booking/ServiceSelector";
import TimeSlotDropdown from "../booking/TimeSlotDropdown";

export default function BookingForm({
  formData,
  onInputChange,
  onSubmit,
  onCancel,
  loading,
}) {
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const minDate = new Date().toISOString().split("T")[0];

  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const h = 8 + Math.floor(i / 2);
    const m = i % 2 ? "30" : "00";
    const period = h >= 12 ? "PM" : "AM";
    const displayH = h > 12 ? h - 12 : h;
    return `${displayH}:${m} ${period}`;
  });

  return (
    <div className="p-8 bg-white rounded-3xl shadow-2xl border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-3xl font-bold text-gray-900">Create New Booking</h3>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl"
        >
          <XCircle className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-10">
        <PersonalInfoSection
          formData={formData}
          onInputChange={onInputChange}
        />

        <ServiceSelector
          selected={formData.service}
          onChange={(v) => onInputChange("service", v)}
        />

        {/* Schedule Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">
              Appointment Schedule
            </h4>
          </div>

          <div className="grid md:grid-cols-2 gap-6 relative">
            <div>
              <label className="block text-sm font-bold mb-3">
                Preferred Date
              </label>
              <input
                type="date"
                min={minDate}
                value={formData.date}
                onChange={(e) => onInputChange("date", e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-2xl"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-bold mb-3">
                Preferred Time
              </label>
              <button
                type="button"
                onClick={() => setShowTimeSlots(!showTimeSlots)}
                className="w-full text-left p-4 border-2 border-gray-200 rounded-2xl"
              >
                {formData.time || "Select time"}
              </button>
              <TimeSlotDropdown
                show={showTimeSlots}
                slots={timeSlots}
                selected={formData.time}
                onSelect={(slot) => {
                  onInputChange("time", slot);
                  setShowTimeSlots(false);
                }}
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-bold mb-3">
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => onInputChange("notes", e.target.value)}
            rows="4"
            className="w-full p-4 border-2 border-gray-200 rounded-2xl resize-none"
            placeholder="Special requirements or medical notes..."
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-8 border-t">
          <button
            onClick={onSubmit}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:scale-105 transition"
          >
            {loading ? "Creating Booking..." : "Confirm Booking"}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-gray-100 border-2 border-gray-200 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-200 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
