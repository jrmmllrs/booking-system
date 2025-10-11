import React, { useState, useEffect, useRef } from "react";
import { Video, CreditCard, Shield } from "lucide-react";

export default function AboutSection({
  title = "Why Choose Us",
  subtitle = "Everything you need for a perfect smile",
  features = [
    {
      icon: Video,
      color: "blue",
      title: "Virtual Consultations",
      description:
        "Connect with our expert orthodontists from the comfort of your home",
    },
    {
      icon: CreditCard,
      color: "green",
      title: "Flexible Payment Plans",
      description: "Affordable monthly payments that fit your budget perfectly",
    },
    {
      icon: Shield,
      color: "purple",
      title: "Lifetime Guarantee",
      description:
        "We stand behind our work with comprehensive warranty coverage",
    },
  ],
}) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

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
    <section ref={sectionRef} className="py-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl font-semibold text-gray-900 mb-4 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-8"
            }`}
          >
            {title}
          </h2>
          <p
            className={`text-lg text-gray-600 transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-8"
            }`}
          >
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            const textClass = colorClasses[feature.color] || colorClasses.blue;
            const bgClass = bgClasses[feature.color] || bgClasses.blue;
            const delay = 400 + idx * 200;

            return (
              <div
                key={idx}
                className={`text-center group transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${delay}ms` }}
              >
                <div
                  className={`w-16 h-16 ${bgClass} rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg`}
                >
                  <Icon
                    className={`w-8 h-8 ${textClass} transition-all duration-500 group-hover:scale-110`}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 transition-colors duration-300 group-hover:text-[#0056A3]">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed transition-colors duration-300 group-hover:text-gray-700">
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
