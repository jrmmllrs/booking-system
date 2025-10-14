import React from "react";
import { Phone, MapPin, Briefcase, Calendar, FileText } from "lucide-react";

export const BookingFormFields = ({ transferData, setTransferData, today }) => (
  <div className="space-y-4">
    {/* Phone Number */}
    <div>
      <label className="block text-xs uppercase tracking-[0.1em] text-gray-600 font-bold mb-2">
        Phone Number <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="tel"
          value={transferData.phone}
          onChange={(e) =>
            setTransferData({ ...transferData, phone: e.target.value })
          }
          placeholder="Enter phone number"
          className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
          required
        />
      </div>
    </div>

    {/* Branch */}
    <div>
      <label className="block text-xs uppercase tracking-[0.1em] text-gray-600 font-bold mb-2">
        Branch <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <select
          value={transferData.branch}
          onChange={(e) =>
            setTransferData({ ...transferData, branch: e.target.value })
          }
          className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm appearance-none"
          required
        >
          <option value="villasis">Villasis, Pangasinan</option>
          <option value="carmen">Carmen, Rosales, Pangasinan</option>
        </select>
      </div>
    </div>

    {/* Service */}
    <div>
      <label className="block text-xs uppercase tracking-[0.1em] text-gray-600 font-bold mb-2">
        Service <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <select
          value={transferData.service}
          onChange={(e) =>
            setTransferData({ ...transferData, service: e.target.value })
          }
          className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm appearance-none"
          required
        >
          <option value="consultation">Consultation</option>
          <option value="cleaning">Cleaning</option>
          <option value="filling">Filling</option>
          <option value="extraction">Extraction</option>
          <option value="root-canal">Root Canal</option>
          <option value="braces">Braces</option>
          <option value="whitening">Whitening</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>

    {/* Date and Time */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-xs uppercase tracking-[0.1em] text-gray-600 font-bold mb-2">
          Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={transferData.date}
          onChange={(e) =>
            setTransferData({ ...transferData, date: e.target.value })
          }
          min={today}
          className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-[0.1em] text-gray-600 font-bold mb-2">
          Time <span className="text-red-500">*</span>
        </label>
        <input
          type="time"
          value={transferData.time}
          onChange={(e) =>
            setTransferData({ ...transferData, time: e.target.value })
          }
          className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
          required
        />
      </div>
    </div>

    {/* Notes */}
    <div>
      <label className="block text-xs uppercase tracking-[0.1em] text-gray-600 font-bold mb-2">
        Additional Notes
      </label>
      <textarea
        value={transferData.notes}
        onChange={(e) =>
          setTransferData({ ...transferData, notes: e.target.value })
        }
        rows="4"
        placeholder="Add any additional notes for this booking..."
        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm transition-all"
      />
    </div>
  </div>
);