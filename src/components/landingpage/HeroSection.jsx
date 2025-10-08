import React from "react";
import { Heart } from "lucide-react";

export default function HeroSection({
  title = "Your smile,",
  subtitle = "our priority",
  description = "Experience world-class dental care with our team of expert dentists.",
  primaryAction = "Book Appointment",
  secondaryAction = "Sign In",
  onPrimaryClick = () => {},
  onSecondaryClick = () => {},
  heroImage = "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop",
  stats = [],
}) {
  return (
    <section className="pt-12 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-8">
              ⭐ Trusted by 10,000+ patients
            </div>

            <h1 className="text-6xl md:text-7xl font-semibold text-gray-900 mb-6 tracking-tight leading-tight">
              {title}
              <br />
              {subtitle}
            </h1>

            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onPrimaryClick}
                className="bg-blue-600 text-white px-8 py-3.5 rounded-full hover:bg-blue-700 transition font-medium"
              >
                {primaryAction}
              </button>
              <button
                onClick={onSecondaryClick}
                className="bg-gray-100 text-gray-900 px-8 py-3.5 rounded-full hover:bg-gray-200 transition font-medium"
              >
                {secondaryAction}
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="Modern dental clinic"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-600 rounded-3xl opacity-10"></div>
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-purple-600 rounded-3xl opacity-10"></div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx}>
              <div className="text-4xl font-semibold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
