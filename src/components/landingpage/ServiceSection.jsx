import React, { useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";

export default function ServicesSection({
  title = "Our Services",
  subtitle = "Comprehensive dental care tailored to your needs",
  services = [],
  onBookClick = () => {},
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
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

  return (
    <div>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.6s ease-out forwards;
        }
        .animate-scale-up {
          animation: scaleUp 0.6s ease-out forwards;
        }
        .shimmer-effect {
          background: linear-gradient(
            90deg,
            rgba(0, 86, 163, 0) 0%,
            rgba(0, 86, 163, 0.1) 50%,
            rgba(0, 86, 163, 0) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      <section
        ref={sectionRef}
        id="services"
        className="py-24 px-6 bg-gray-50 relative overflow-hidden"
      >
        {/* Background Decoration */}
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 -z-0 animate-pulse"
          style={{ animationDuration: "5s" }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-80 h-80 bg-green-100 rounded-full blur-3xl opacity-20 -z-0 animate-pulse"
          style={{ animationDuration: "6s" }}
        ></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2
              className={`text-4xl md:text-5xl font-semibold text-gray-900 mb-4 ${
                isVisible ? "animate-fade-in-down" : "opacity-0"
              }`}
              style={{ animationDelay: "0.1s" }}
            >
              {title}
            </h2>
            <p
              className={`text-lg text-gray-600 ${
                isVisible ? "animate-fade-in-down" : "opacity-0"
              }`}
              style={{ animationDelay: "0.2s" }}
            >
              {subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, idx) => {
              const Icon = service.icon;
              const isHovered = hoveredCard === idx;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 cursor-pointer group relative overflow-hidden transform ${
                    isHovered ? "scale-105 -translate-y-2" : "scale-100"
                  } ${isVisible ? "animate-scale-up" : "opacity-0"}`}
                  style={{
                    animationDelay: `${0.3 + idx * 0.1}s`,
                    border: isHovered
                      ? "2px solid #0056A3"
                      : "2px solid transparent",
                  }}
                >
                  {/* Shimmer effect on hover */}
                  {isHovered && (
                    <div className="absolute inset-0 shimmer-effect pointer-events-none"></div>
                  )}

                  <div className="flex items-start justify-between mb-6 relative z-10">
                    <div
                      className={`w-12 h-12 bg-[#0056A3]/10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                        isHovered
                          ? "bg-[#0056A3] rotate-12 scale-110"
                          : "bg-[#0056A3]/10 rotate-0"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 transition-colors duration-500 ${
                          isHovered ? "text-white" : "text-[#0056A3]"
                        }`}
                      />
                    </div>
                    {service.price && (
                      <div
                        className={`text-2xl font-bold transition-all duration-300 ${
                          isHovered
                            ? "text-[#0056A3] scale-110"
                            : "text-gray-900"
                        }`}
                      >
                        {service.price}
                      </div>
                    )}
                  </div>

                  <h3
                    className={`text-xl font-semibold mb-3 transition-colors duration-300 relative z-10 ${
                      isHovered ? "text-[#0056A3]" : "text-gray-900"
                    }`}
                  >
                    {service.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed relative z-10">
                    {service.desc}
                  </p>

                  <button
                    onClick={onBookClick}
                    className={`text-[#0056A3] text-sm font-medium flex items-center gap-1 transition-all duration-300 relative z-10 ${
                      isHovered ? "gap-3" : "gap-1"
                    }`}
                  >
                    Book Now
                    <ChevronRight
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isHovered ? "translate-x-1" : "translate-x-0"
                      }`}
                    />
                  </button>

                  {/* Animated corner accent */}
                  <div
                    className={`absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-[#0056A3]/10 to-transparent rounded-tl-full transition-all duration-500 ${
                      isHovered
                        ? "w-32 h-32 opacity-100"
                        : "w-20 h-20 opacity-0"
                    }`}
                  ></div>
                </div>
              );
            })}
          </div>

          {/* Optional: Add a decorative line under the section */}
          <div
            className={`mt-16 h-1 bg-gradient-to-r from-transparent via-[#0056A3]/30 to-transparent ${
              isVisible ? "animate-scale-up" : "opacity-0"
            }`}
            style={{ animationDelay: `${0.3 + services.length * 0.1}s` }}
          ></div>
        </div>
      </section>
    </div>
  );
}
