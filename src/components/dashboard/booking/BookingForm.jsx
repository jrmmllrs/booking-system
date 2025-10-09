import React, { useState } from "react";
import { XCircle, Calendar, Clock, FileText, User, Briefcase, ArrowRight, ArrowLeft, Check } from "lucide-react";

// Mock components - replace with your actual imports
const PersonalInfoSection = ({ formData, onInputChange }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-semibold mb-2 text-gray-700">Full Name</label>
      <input
        type="text"
        value={formData.name || ""}
        onChange={(e) => onInputChange("name", e.target.value)}
        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
        placeholder="John Doe"
      />
    </div>
    <div>
      <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
      <input
        type="email"
        value={formData.email || ""}
        onChange={(e) => onInputChange("email", e.target.value)}
        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
        placeholder="john@example.com"
      />
    </div>
    <div>
      <label className="block text-sm font-semibold mb-2 text-gray-700">Phone</label>
      <input
        type="tel"
        value={formData.phone || ""}
        onChange={(e) => onInputChange("phone", e.target.value)}
        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
        placeholder="+1 (555) 000-0000"
      />
    </div>
  </div>
);

const ServiceSelector = ({ selected, onChange }) => {
  const services = [
    { id: "consultation", name: "Consultation", duration: "30 min" },
    { id: "checkup", name: "General Checkup", duration: "45 min" },
    { id: "treatment", name: "Treatment", duration: "60 min" },
    { id: "followup", name: "Follow-up", duration: "20 min" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {services.map((service) => (
        <button
          key={service.id}
          type="button"
          onClick={() => onChange(service.id)}
          className={`p-6 border-2 rounded-xl text-left transition-all ${
            selected === service.id
              ? "border-blue-500 bg-blue-50 shadow-lg"
              : "border-gray-200 hover:border-gray-300 hover:shadow-md"
          }`}
        >
          <div className="font-bold text-lg text-gray-900">{service.name}</div>
          <div className="text-sm text-gray-500 mt-1">{service.duration}</div>
        </button>
      ))}
    </div>
  );
};

const TimeSlotDropdown = ({ show, slots, selected, onSelect }) => {
  if (!show) return null;
  
  return (
    <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
      {slots.map((slot, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onSelect(slot)}
          className={`w-full text-left p-3 hover:bg-blue-50 transition-colors ${
            selected === slot ? "bg-blue-100 font-semibold" : ""
          }`}
        >
          {slot}
        </button>
      ))}
    </div>
  );
};

export default function BookingForm({
  formData,
  onInputChange,
  onSubmit,
  onCancel,
  loading,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const minDate = new Date().toISOString().split("T")[0];

  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const h = 8 + Math.floor(i / 2);
    const m = i % 2 ? "30" : "00";
    const period = h >= 12 ? "PM" : "AM";
    const displayH = h > 12 ? h - 12 : h;
    return `${displayH}:${m} ${period}`;
  });

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Select Service", icon: Briefcase },
    { number: 3, title: "Date & Time", icon: Calendar },
    { number: 4, title: "Review", icon: FileText },
  ];

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.email && formData.phone;
      case 2:
        return formData.service;
      case 3:
        return formData.date && formData.time;
      default:
        return true;
    }
  };

  return (
    <div className="p-8 bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900">Create New Booking</h3>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <XCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
            <div
              className="h-full bg-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />
          </div>

          {/* Step Indicators */}
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <div key={step.number} className="flex flex-col items-center relative">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? "bg-blue-500 shadow-lg"
                      : isActive
                      ? "bg-blue-500 shadow-lg scale-110"
                      : "bg-gray-200"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : (
                    <Icon
                      className={`w-6 h-6 ${
                        isActive ? "text-white" : "text-gray-400"
                      }`}
                    />
                  )}
                </div>
                <span
                  className={`mt-3 text-xs font-semibold text-center max-w-[80px] ${
                    isActive || isCompleted ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {/* Step 1: Personal Info */}
        {currentStep === 1 && (
          <div className="animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">
                Personal Information
              </h4>
            </div>
            <PersonalInfoSection
              formData={formData}
              onInputChange={onInputChange}
            />
          </div>
        )}

        {/* Step 2: Service Selection */}
        {currentStep === 2 && (
          <div className="animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">
                Select Service
              </h4>
            </div>
            <ServiceSelector
              selected={formData.service}
              onChange={(v) => onInputChange("service", v)}
            />
          </div>
        )}

        {/* Step 3: Date & Time */}
        {currentStep === 3 && (
          <div className="animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">
                Choose Date & Time
              </h4>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-3 text-gray-700">
                  Preferred Date
                </label>
                <input
                  type="date"
                  min={minDate}
                  value={formData.date}
                  onChange={(e) => onInputChange("date", e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-bold mb-3 text-gray-700">
                  Preferred Time
                </label>
                <button
                  type="button"
                  onClick={() => setShowTimeSlots(!showTimeSlots)}
                  className="w-full text-left p-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
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

            <div className="mt-6">
              <label className="block text-sm font-bold mb-3 text-gray-700">
                Additional Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => onInputChange("notes", e.target.value)}
                rows="4"
                className="w-full p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Special requirements or medical notes..."
              />
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div className="animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">
                Review Booking
              </h4>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <h5 className="font-bold text-lg mb-4 text-gray-900">Personal Information</h5>
                <div className="space-y-2 text-gray-700">
                  <p><span className="font-semibold">Name:</span> {formData.name}</p>
                  <p><span className="font-semibold">Email:</span> {formData.email}</p>
                  <p><span className="font-semibold">Phone:</span> {formData.phone}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <h5 className="font-bold text-lg mb-4 text-gray-900">Service Details</h5>
                <div className="space-y-2 text-gray-700">
                  <p><span className="font-semibold">Service:</span> {formData.service}</p>
                  <p><span className="font-semibold">Date:</span> {formData.date}</p>
                  <p><span className="font-semibold">Time:</span> {formData.time}</p>
                </div>
              </div>

              {formData.notes && (
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                  <h5 className="font-bold text-lg mb-4 text-gray-900">Additional Notes</h5>
                  <p className="text-gray-700">{formData.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 pt-8 mt-8 border-t-2 border-gray-100">
        {currentStep > 1 && (
          <button
            onClick={prevStep}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-4 bg-gray-100 border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>
        )}

        <div className="flex-1" />

        {currentStep < 4 ? (
          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg"
          >
            Next
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
          >
            {loading ? "Creating Booking..." : "Confirm Booking"}
            <Check className="w-5 h-5" />
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}