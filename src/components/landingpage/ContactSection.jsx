// src/components/ContactSection.jsx
import React, { useState } from "react";
import { MapPin, Clock, CheckCircle } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// ⚠️ IMPORTANT: Update this import path to match your firebase config location
// Common paths: "../firebase" or "../firebase/config" or "../config/firebase"
import { db } from "../../firebase";

export default function ContactSection({
  title = "Get In Touch",
  subtitle = "Have questions? We're here to help. Contact us or visit our clinic.",
  address = "123 Dental Street, Healthcare City",
  hours = ["Mon-Fri: 9AM - 6PM", "Sat: 9AM - 2PM"],
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "contacts"), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        status: "unread",
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });

      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
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

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700 text-sm">
              <CheckCircle className="w-5 h-5" />
              <span>
                Message sent successfully! We'll get back to you soon.
              </span>
            </div>
          )}

          <div className="space-y-5">
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={loading}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={loading}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <textarea
              placeholder="Your Message"
              rows="4"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              disabled={loading}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            ></textarea>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
