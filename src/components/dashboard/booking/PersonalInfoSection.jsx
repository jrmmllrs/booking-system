import { User, Mail, Phone } from "lucide-react";

export default function PersonalInfoSection({ formData, onInputChange }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
          <User className="w-5 h-5 text-white" />
        </div>
        <h4 className="text-xl font-bold text-gray-900">Personal Information</h4>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { label: "Full Name", id: "name", icon: <User />, type: "text", placeholder: "Juan Dela Cruz" },
          { label: "Email Address", id: "email", icon: <Mail />, type: "email", placeholder: "juan@email.com" },
          { label: "Phone Number", id: "phone", icon: <Phone />, type: "tel", placeholder: "+63 917 123 4567" },
        ].map((field) => (
          <div key={field.id} className="group">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              {field.label} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                {field.icon}
              </div>
              <input
                type={field.type}
                value={formData[field.id]}
                onChange={(e) => onInputChange(field.id, e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all outline-none font-medium"
                placeholder={field.placeholder}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
