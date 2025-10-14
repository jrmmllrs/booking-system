import React, { useState, useEffect } from "react";
import {
  XCircle,
  Calendar,
  Clock,
  FileText,
  User,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Check,
  MapPin,
} from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";

const PersonalInfoSection = ({ formData, onInputChange }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-semibold mb-2 text-gray-700">
        Full Name
      </label>
      <input
        type="text"
        value={formData.name || ""}
        onChange={(e) => onInputChange("name", e.target.value)}
        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#0056A3] focus:outline-none transition-colors"
        placeholder="John Doe"
      />
    </div>
    <div>
      <label className="block text-sm font-semibold mb-2 text-gray-700">
        Email
      </label>
      <input
        type="email"
        value={formData.email || ""}
        onChange={(e) => onInputChange("email", e.target.value)}
        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#0056A3] focus:outline-none transition-colors"
        placeholder="john@example.com"
      />
    </div>
    <div>
      <label className="block text-sm font-semibold mb-2 text-gray-700">
        Phone
      </label>
      <input
        type="tel"
        value={formData.phone || ""}
        onChange={(e) => onInputChange("phone", e.target.value)}
        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#0056A3] focus:outline-none transition-colors"
        placeholder="+63 XXX XXX XXXX"
      />
    </div>
  </div>
);

const BranchSelector = ({ selected, onChange }) => {
  const branches = [
    {
      id: "villasis",
      name: "Villasis Branch",
      location: "Villasis, Pangasinan",
      address: "Main Street, Villasis",
    },
    {
      id: "carmen",
      name: "Carmen Branch",
      location: "Carmen, Rosales, Pangasinan",
      address: "Carmen, Rosales",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {branches.map((branch) => (
        <button
          key={branch.id}
          type="button"
          onClick={() => onChange(branch.id)}
          className={`group relative p-6 border-2 rounded-xl text-left transition-all ${
            selected === branch.id
              ? "border-[#0056A3] bg-gradient-to-br from-[#0056A3]/5 to-[#009846]/5 shadow-lg"
              : "border-gray-200 hover:border-gray-300 hover:shadow-md"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                selected === branch.id
                  ? "bg-gradient-to-br from-[#0056A3] to-[#009846]"
                  : "bg-gray-100"
              }`}
            >
              <MapPin
                className={`w-5 h-5 ${
                  selected === branch.id ? "text-white" : "text-gray-600"
                }`}
              />
            </div>
            <div className="flex-1">
              <div className="font-bold text-lg text-gray-900">
                {branch.name}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {branch.location}
              </div>
              <div className="text-xs text-gray-500 mt-1">{branch.address}</div>
            </div>
          </div>
          {selected === branch.id && (
            <div className="absolute top-3 right-3">
              <div className="w-6 h-6 bg-gradient-to-br from-[#0056A3] to-[#009846] rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

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
              ? "border-[#0056A3] bg-gradient-to-br from-[#0056A3]/5 to-[#009846]/5 shadow-lg"
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

const TimeSlotDropdown = ({
  show,
  slots,
  selected,
  onSelect,
  bookedSlots,
  loading,
  formData,
}) => {
  if (!show) return null;

  // Check if selected date is today
  const isToday = formData?.date === new Date().toISOString().split("T")[0];
  const now = new Date();

  // Helper: Convert "8:30 AM" → Date object for today
  const parseTime = (timeStr) => {
    const [time, period] = timeStr.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    let h = hours % 12;
    if (period === "PM") h += 12;
    const d = new Date();
    d.setHours(h, minutes || 0, 0, 0);
    return d;
  };

  const filteredSlots = slots.filter((slot) => {
    const isBooked = bookedSlots.includes(slot);
    if (!isToday) return !isBooked; // keep all for future days

    const slotTime = parseTime(slot);
    return !isBooked && slotTime > now; // only upcoming times today
  });

  return (
    <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
      {loading ? (
        <div className="p-4 text-center text-gray-500">
          <Clock className="w-5 h-5 mx-auto mb-2 animate-spin" />
          <span className="text-sm">Loading available slots...</span>
        </div>
      ) : (
        filteredSlots.map((slot, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(slot)}
            className={`w-full text-left p-3 transition-colors ${
              selected === slot
                ? "bg-[#0056A3]/10 font-semibold text-[#0056A3] hover:bg-[#0056A3]/15"
                : "hover:bg-[#0056A3]/5"
            }`}
          >
            <span>{slot}</span>
          </button>
        ))
      )}
    </div>
  );
};

export default function BookingForm({
  formData,
  onInputChange,
  onSubmit,
  onCancel,
  loading,
  db,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const minDate = new Date().toISOString().split("T")[0];

  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const h = 8 + Math.floor(i / 2);
    const m = i % 2 ? "30" : "00";
    const period = h >= 12 ? "PM" : "AM";
    const displayH = h > 12 ? h - 12 : h;
    return `${displayH}:${m} ${period}`;
  });

  // Fetch booked time slots when date or branch changes
  useEffect(() => {
    if (formData.date && formData.branch && db) {
      fetchBookedSlots();
    } else {
      setBookedSlots([]);
    }
  }, [formData.date, formData.branch, db]);

  const fetchBookedSlots = async () => {
    setLoadingSlots(true);
    try {
      const bookingsRef = collection(db, "bookings");
      const q = query(
        bookingsRef,
        where("date", "==", formData.date),
        where("branch", "==", formData.branch),
        where("status", "==", "confirmed")
      );

      const snapshot = await getDocs(q);
      const bookedTimes = snapshot.docs.map((doc) => doc.data().time);
      setBookedSlots(bookedTimes);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
      setBookedSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Select Branch", icon: MapPin },
    { number: 3, title: "Select Service", icon: Briefcase },
    { number: 4, title: "Date & Time", icon: Calendar },
    { number: 5, title: "Review", icon: FileText },
  ];

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.email && formData.phone;
      case 2:
        return formData.branch;
      case 3:
        return formData.service;
      case 4:
        return formData.date && formData.time;
      default:
        return true;
    }
  };

  const getBranchName = (branchId) => {
    const branches = {
      villasis: "Villasis, Pangasinan Branch",
      carmen: "Carmen, Rosales, Pangasinan Branch",
    };
    return branches[branchId] || branchId;
  };

  const getServiceName = (serviceId) => {
    const services = {
      consultation: "Consultation (30 min)",
      checkup: "General Checkup (45 min)",
      treatment: "Treatment (60 min)",
      followup: "Follow-up (20 min)",
    };
    return services[serviceId] || serviceId;
  };

  return (
    <div className="p-8 bg-white rounded-2xl border border-gray-100 max-w-4xl mx-auto transition-all duration-300 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
          Create New Booking
        </h3>
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
              className="h-full bg-gradient-to-r from-[#0056A3] to-[#009846] transition-all duration-500 ease-out"
              style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
            />
          </div>

          {/* Step Indicators */}
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <div
                key={step.number}
                className="flex flex-col items-center relative"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? "bg-gradient-to-br from-[#0056A3] to-[#009846] shadow-lg"
                      : isActive
                      ? "bg-gradient-to-br from-[#0056A3] to-[#009846] shadow-lg scale-110"
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
              <div className="w-10 h-10 bg-gradient-to-br from-[#0056A3] to-[#009846] rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 tracking-tight">
                Personal Information
              </h4>
            </div>
            <PersonalInfoSection
              formData={formData}
              onInputChange={onInputChange}
            />
          </div>
        )}

        {/* Step 2: Branch Selection */}
        {currentStep === 2 && (
          <div className="animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0056A3] to-[#009846] rounded-xl flex items-center justify-center shadow-lg">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 tracking-tight">
                Select Branch
              </h4>
            </div>
            <BranchSelector
              selected={formData.branch}
              onChange={(v) => onInputChange("branch", v)}
            />
          </div>
        )}

        {/* Step 3: Service Selection */}
        {currentStep === 3 && (
          <div className="animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0056A3] to-[#009846] rounded-xl flex items-center justify-center shadow-lg">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 tracking-tight">
                Select Service
              </h4>
            </div>
            <ServiceSelector
              selected={formData.service}
              onChange={(v) => onInputChange("service", v)}
            />
          </div>
        )}

        {/* Step 4: Date & Time */}
        {currentStep === 4 && (
          <div className="animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0056A3] to-[#009846] rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 tracking-tight">
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
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#0056A3] focus:outline-none transition-colors"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-bold mb-3 text-gray-700">
                  Preferred Time
                </label>
                <button
                  type="button"
                  onClick={() => setShowTimeSlots(!showTimeSlots)}
                  disabled={!formData.date || !formData.branch}
                  className="w-full text-left p-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formData.time ||
                    (formData.date && formData.branch
                      ? "Select time"
                      : "Select date and branch first")}
                </button>
                <TimeSlotDropdown
                  show={showTimeSlots}
                  slots={timeSlots}
                  selected={formData.time}
                  bookedSlots={bookedSlots}
                  loading={loadingSlots}
                  formData={formData} // ✅ add this line
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
                value={formData.notes || ""}
                onChange={(e) => onInputChange("notes", e.target.value)}
                rows="4"
                className="w-full p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-[#0056A3] focus:outline-none transition-colors"
                placeholder="Special requirements or medical notes..."
              />
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {currentStep === 5 && (
          <div className="animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0056A3] to-[#009846] rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 tracking-tight">
                Review Booking
              </h4>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
                <h5 className="font-bold text-lg mb-4 text-gray-900">
                  Personal Information
                </h5>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-semibold">Name:</span> {formData.name}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {formData.email}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {formData.phone}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
                <h5 className="font-bold text-lg mb-4 text-gray-900">
                  Branch & Service
                </h5>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-semibold">Branch:</span>{" "}
                    {getBranchName(formData.branch)}
                  </p>
                  <p>
                    <span className="font-semibold">Service:</span>{" "}
                    {getServiceName(formData.service)}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
                <h5 className="font-bold text-lg mb-4 text-gray-900">
                  Appointment Details
                </h5>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-semibold">Date:</span> {formData.date}
                  </p>
                  <p>
                    <span className="font-semibold">Time:</span> {formData.time}
                  </p>
                </div>
              </div>

              {formData.notes && (
                <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
                  <h5 className="font-bold text-lg mb-4 text-gray-900">
                    Additional Notes
                  </h5>
                  <p className="text-gray-700">{formData.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 pt-8 mt-8 border-t border-gray-100">
        {currentStep > 1 && (
          <button
            onClick={prevStep}
            disabled={loading}
            className="group/btn relative overflow-hidden transition-all duration-500 disabled:opacity-50"
          >
            <div className="relative px-6 py-4 bg-white border-2 border-gray-200 rounded-xl transition-all duration-500 group-hover/btn:border-transparent group-hover/btn:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
              <div className="relative z-10 flex items-center gap-2">
                <ArrowLeft className="w-5 h-5 text-gray-600 group-hover/btn:text-gray-900 transition-colors duration-500" />
                <span className="text-sm font-semibold text-gray-700 group-hover/btn:text-gray-900 transition-colors duration-500">
                  Previous
                </span>
              </div>
            </div>
          </button>
        )}

        <div className="flex-1" />

        {currentStep < 5 ? (
          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className="group/btn relative overflow-hidden transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="relative px-8 py-4 bg-white border-2 border-gray-200 rounded-xl transition-all duration-500 group-hover/btn:border-transparent group-hover/btn:shadow-lg group-hover/btn:shadow-[#0056A3]/10">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0056A3] to-[#009846] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
              <div className="relative z-10 flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700 group-hover/btn:text-white transition-colors duration-500">
                  Next
                </span>
                <ArrowRight className="w-5 h-5 text-gray-600 group-hover/btn:text-white transition-colors duration-500" />
              </div>
            </div>
          </button>
        ) : (
          <button
            onClick={onSubmit}
            disabled={loading}
            className="group/btn relative overflow-hidden transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="relative px-8 py-4 bg-white border-2 border-gray-200 rounded-xl transition-all duration-500 group-hover/btn:border-transparent group-hover/btn:shadow-lg group-hover/btn:shadow-[#009846]/10">
              <div className="absolute inset-0 bg-gradient-to-br from-[#009846] to-[#009846]/80 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
              <div className="relative z-10 flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700 group-hover/btn:text-white transition-colors duration-500">
                  {loading ? "Creating Booking..." : "Confirm Booking"}
                </span>
                <Check className="w-5 h-5 text-gray-600 group-hover/btn:text-white transition-colors duration-500" />
              </div>
            </div>
          </button>
        )}
      </div>

      <style>{`
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
