import { Stethoscope } from "lucide-react";
import { dentalServices } from "./service";

export default function ServiceSelector({ selected, onChange }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
          <Stethoscope className="w-5 h-5 text-white" />
        </div>
        <h4 className="text-xl font-bold text-gray-900">Select Service</h4>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {dentalServices.map((service) => (
          <button
            key={service.id}
            type="button"
            onClick={() => onChange(service.id)}
            className={`p-5 rounded-2xl border-2 transition-all ${
              selected === service.id
                ? "border-blue-500 bg-blue-600 text-white shadow-xl scale-105"
                : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg hover:scale-105"
            }`}
          >
            {service.name}
          </button>
        ))}
      </div>
    </div>
  );
}
