export default function TimeSlotDropdown({ show, slots, selected, onSelect }) {
  if (!show) return null;
  return (
    <div className="absolute z-20 mt-2 w-full bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-4 max-h-80 overflow-y-auto">
      <div className="grid grid-cols-3 gap-2">
        {slots.map((slot) => (
          <button
            key={slot}
            type="button"
            onClick={() => onSelect(slot)}
            className={`px-4 py-3 rounded-xl text-sm font-bold ${
              selected === slot
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-50 hover:bg-gray-100 text-gray-700"
            }`}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
}
