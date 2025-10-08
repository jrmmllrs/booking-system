import React, { useState } from "react";
import { MapPin, Clock } from "lucide-react";

export default function ContactSection({
  title = "Get In Touch",
  subtitle = "Have questions? We're here to help. Contact us or visit our clinic.",
  address = "123 Dental Street, Healthcare City",
  hours = ["Mon-Fri: 9AM - 6PM", "Sat: 9AM - 2PM"],
  onSubmit = () => {},
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-4xl font-semibold text-gray-900 mb-6">{title}</h2>
          <p className="text-gray-600 mb-12 leading-relaxed">{subtitle}</p>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Address</p>
                <p className="text-gray-600 text-sm">{address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Hours</p>
                {hours.map((hour, idx) => (
                  <p key={idx} className="text-gray-600 text-sm">
                    {hour}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-3xl p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8">
            Quick Contact
          </h3>
          <div className="space-y-5">
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400"
            />
            <textarea
              placeholder="Your Message"
              rows="4"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400 resize-none"
            ></textarea>
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 transition font-medium"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
