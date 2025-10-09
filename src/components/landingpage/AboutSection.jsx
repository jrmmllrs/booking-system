import React from "react";
import { Video, CreditCard, Shield } from "lucide-react";

export default function AboutSection({
  title = "Why Choose Us",
  subtitle = "Everything you need for a perfect smile",
  features = [],
}) {
  const colorClasses = {
    blue: "text-[#0056A3]",
    purple: "text-[#009846]",
    green: "text-[#009846]",
  };

  const bgClasses = {
    blue: "bg-[#0056A3]/10",
    purple: "bg-[#009846]/10",
    green: "bg-[#009846]/10",
  };

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            const textClass = colorClasses[feature.color] || colorClasses.blue;
            const bgClass = bgClasses[feature.color] || bgClasses.blue;

            return (
              <div key={idx} className="text-center">
                <div
                  className={`w-16 h-16 ${bgClass} rounded-full flex items-center justify-center mx-auto mb-6`}
                >
                  <Icon className={`w-8 h-8 ${textClass}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}