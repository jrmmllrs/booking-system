import React from "react";

export default function TimeSlotDropdown({
  show,
  slots = [],
  selected,
  onSelect,
  bookedSlots = [],
}) {
  if (!show) return null;

  return (
    <div className="absolute z-20 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 max-h-80 overflow-y-auto">
      <div className="grid grid-cols-3 gap-2">
        {slots.map((slot) => {
          const isBooked = bookedSlots.includes(slot);
          const isSelected = selected === slot;

          return (
            <button
              key={slot}
              type="button"
              onClick={() => !isBooked && onSelect(slot)}
              disabled={isBooked}
              className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isBooked
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : isSelected
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-700"
              }`}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
}
