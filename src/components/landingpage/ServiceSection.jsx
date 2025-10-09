import React from "react";
import { ChevronRight } from "lucide-react";

export default function ServicesSection({
  title = "Our Services",
  subtitle = "Comprehensive dental care tailored to your needs",
  services = [],
  onBookClick = () => {}
}) {
  return (
    <section id="services" className="py-24 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 hover:shadow-lg transition cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 bg-[#0056A3]/10 rounded-xl flex items-center justify-center group-hover:bg-[#0056A3]/20 transition">
                    <Icon className="w-6 h-6 text-[#0056A3]" />
                  </div>
                  {service.price && (
                    <div className="text-2xl font-bold text-gray-900">
                      {service.price}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {service.desc}
                </p>
                <button
                  onClick={onBookClick}
                  className="text-[#0056A3] text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Book Now <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}