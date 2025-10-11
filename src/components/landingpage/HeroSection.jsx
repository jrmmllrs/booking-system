import React, { useState, useEffect } from "react";
import {
  Calendar,
  Shield,
  Award,
  Star,
  CheckCircle,
  Sparkles,
} from "lucide-react";

export default function HeroSection({
  title = "Your smile,",
  subtitle = "our priority",
  description = "Experience world-class dental care with our team of expert dentists. Serving Filipino families with compassion and excellence.",
  primaryAction = "Book Appointment",
  secondaryAction = "View Services",
  onPrimaryClick = () => {},
  onSecondaryClick = () => {},
  heroImage = "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop",
  stats = [
    { value: "15+", label: "Years Serving", icon: Award },
    { value: "10K+", label: "Happy Patients", icon: Star },
    { value: "24/7", label: "Emergency Care", icon: Shield },
  ],
  features = [
    "PhilHealth & HMO Accepted",
    "DOH Licensed Dentists",
    "Flexible Payment Plans",
  ],
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredStat, setHoveredStat] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out forwards;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out forwards;
        }
        .animate-slide-in-up {
          animation: slideInUp 0.8s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.6s ease-out forwards;
        }
      `}</style>

      {/* Animated Background Decoration */}
      <div
        className="absolute top-20 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 -z-10 animate-pulse"
        style={{ backgroundColor: "#0056A3", animationDuration: "4s" }}
      ></div>
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-15 -z-10 animate-pulse"
        style={{ backgroundColor: "#009846", animationDuration: "5s" }}
      ></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className={`${isVisible ? "opacity-100" : "opacity-0"}`}>
            {/* Trust Badge */}
            <div
              className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full mb-8 border ${
                isVisible ? "animate-slide-in-left" : "opacity-0"
              }`}
              style={{
                color: "#0056A3",
                backgroundColor: "#E6F2FF",
                borderColor: "#0056A3",
                animationDelay: "0.1s",
              }}
            >
              <Star
                className="w-4 h-4 animate-pulse"
                style={{ fill: "#0056A3", animationDuration: "2s" }}
              />
              <span>Trusted by 10,000+ Filipino Families</span>
            </div>

            {/* Main Headline */}
            <h1
              className={`text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight ${
                isVisible ? "animate-slide-in-left" : "opacity-0"
              }`}
              style={{ animationDelay: "0.2s" }}
            >
              {title}
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #0056A3, #009846)",
                }}
              >
                {subtitle}
              </span>
            </h1>

            {/* Description */}
            <p
              className={`text-xl text-gray-600 mb-8 leading-relaxed ${
                isVisible ? "animate-fade-in" : "opacity-0"
              }`}
              style={{ animationDelay: "0.3s" }}
            >
              {description}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 mb-10">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 text-sm font-medium text-gray-700 bg-white px-4 py-2.5 rounded-full shadow-sm border border-gray-200 hover:shadow-md hover:scale-105 transition-all duration-300 ${
                    isVisible ? "animate-scale-in" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${0.4 + idx * 0.1}s` }}
                >
                  <CheckCircle
                    className="w-4 h-4"
                    style={{ color: "#009846" }}
                  />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 ${
                isVisible ? "animate-slide-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: "0.7s" }}
            >
              <button
                onClick={onPrimaryClick}
                className="group flex items-center justify-center gap-2 text-white px-8 py-4 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transform"
                style={{ backgroundColor: "#0056A3" }}
              >
                <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>{primaryAction}</span>
              </button>
              <button
                onClick={onSecondaryClick}
                className="flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-50 hover:scale-105 transition-all duration-300 font-semibold shadow-md border-2 transform"
                style={{ borderColor: "#0056A3", color: "#0056A3" }}
              >
                <span>{secondaryAction}</span>
              </button>
            </div>
          </div>

          {/* Right Image Section */}
          <div
            className={`relative ${
              isVisible ? "animate-slide-in-right" : "opacity-0"
            }`}
            style={{ animationDelay: "0.3s" }}
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500 animate-float">
              <img
                src={heroImage}
                alt="Modern dental clinic"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
            </div>

            {/* Floating Badge - DOH Certified */}
            <div
              className={`absolute top-6 right-6 bg-white rounded-2xl px-5 py-3 shadow-xl backdrop-blur-sm hover:scale-110 transition-transform duration-300 ${
                isVisible ? "animate-scale-in" : "opacity-0"
              }`}
              style={{ animationDelay: "0.8s" }}
            >
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" style={{ color: "#0056A3" }} />
                <div>
                  <p className="text-xs font-bold text-gray-900">
                    DOH Certified
                  </p>
                  <p className="text-xs text-gray-600">Licensed Clinic</p>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div
              className="absolute -bottom-6 -right-6 w-32 h-32 rounded-3xl opacity-10 blur-xl -z-10 animate-pulse"
              style={{
                background:
                  "linear-gradient(to bottom right, #0056A3, #009846)",
                animationDuration: "3s",
              }}
            ></div>
            <div
              className="absolute -top-6 -left-6 w-24 h-24 rounded-3xl opacity-10 blur-xl -z-10 animate-pulse"
              style={{
                background:
                  "linear-gradient(to bottom right, #009846, #0056A3)",
                animationDuration: "4s",
              }}
            ></div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 grid grid-cols-3 gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredStat(idx)}
                onMouseLeave={() => setHoveredStat(null)}
                className={`bg-white rounded-2xl p-6 text-center hover:shadow-2xl transition-all duration-500 border border-gray-100 cursor-pointer transform ${
                  hoveredStat === idx ? "scale-110 -translate-y-2" : "scale-100"
                } ${isVisible ? "animate-slide-in-up" : "opacity-0"}`}
                style={{ animationDelay: `${1.0 + idx * 0.1}s` }}
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-all duration-500 ${
                    hoveredStat === idx ? "rotate-12 scale-110" : "rotate-0"
                  }`}
                  style={{ backgroundColor: "#E6F2FF" }}
                >
                  <Icon className="w-6 h-6" style={{ color: "#0056A3" }} />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
