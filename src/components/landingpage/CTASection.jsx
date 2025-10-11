import React, { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";

export default function CTASection({
  title = "Everything You Need for Perfect Dental Care",
  subtitle = "We make dental care accessible, affordable, and comfortable for everyone.",
  benefits = [],
  buttonText = "Get Started",
  onButtonClick = () => {},
  variant = "gradient", // "gradient" or "simple"
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredBenefit, setHoveredBenefit] = useState(null);
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

  if (variant === "gradient") {
    return (
      <div>
        <style>{`
          @keyframes fadeInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes fadeInRight {
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
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
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
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          @keyframes checkPop {
            0% {
              transform: scale(0) rotate(-45deg);
            }
            50% {
              transform: scale(1.2) rotate(0deg);
            }
            100% {
              transform: scale(1) rotate(0deg);
            }
          }
          .animate-fade-in-left {
            animation: fadeInLeft 0.8s ease-out forwards;
          }
          .animate-fade-in-right {
            animation: fadeInRight 0.8s ease-out forwards;
          }
          .animate-slide-in-up {
            animation: slideInUp 0.6s ease-out forwards;
          }
          .animate-pulse-custom {
            animation: pulse 2s ease-in-out infinite;
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          .animate-check-pop {
            animation: checkPop 0.5s ease-out forwards;
          }
          .shimmer-button {
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.3) 50%,
              rgba(255, 255, 255, 0) 100%
            );
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }
        `}</style>

        <section
          ref={sectionRef}
          className="py-24 px-6 bg-gradient-to-br from-[#0056A3] to-[#004080] text-gray-900 relative overflow-hidden"
        >
          {/* Animated background elements */}
          <div className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse-custom"></div>
          <div
            className="absolute bottom-10 left-10 w-80 h-80 bg-[#009846]/10 rounded-full blur-3xl animate-pulse-custom"
            style={{ animationDelay: "1s" }}
          ></div>

          {/* Floating particles */}
          <div className="absolute top-20 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-float"></div>
          <div
            className="absolute bottom-32 right-1/3 w-3 h-3 bg-white/20 rounded-full animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/4 w-2 h-2 bg-white/25 rounded-full animate-float"
            style={{ animationDelay: "2s" }}
          ></div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className={`${isVisible ? "opacity-100" : "opacity-0"}`}>
                <h2
                  className={`text-4xl md:text-5xl font-semibold mb-6 text-white ${
                    isVisible ? "animate-fade-in-left" : "opacity-0"
                  }`}
                  style={{ animationDelay: "0.1s" }}
                >
                  {title}
                </h2>
                <p
                  className={`text-blue-100 text-lg leading-relaxed mb-8 ${
                    isVisible ? "animate-fade-in-left" : "opacity-0"
                  }`}
                  style={{ animationDelay: "0.2s" }}
                >
                  {subtitle}
                </p>
                <button
                  onClick={onButtonClick}
                  className={`group relative bg-white text-[#0056A3] px-8 py-3.5 rounded-full hover:bg-gray-100 transition-all duration-300 font-medium shadow-lg hover:shadow-2xl hover:scale-105 transform overflow-hidden ${
                    isVisible ? "animate-slide-in-up" : "opacity-0"
                  }`}
                  style={{ animationDelay: "0.3s" }}
                >
                  <span className="relative z-10">{buttonText}</span>
                  <div className="absolute inset-0 shimmer-button opacity-0 group-hover:opacity-100"></div>
                </button>
              </div>

              {/* Right Benefits */}
              <div className="space-y-4">
                {benefits.map((benefit, idx) => {
                  const isHovered = hoveredBenefit === idx;
                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredBenefit(idx)}
                      onMouseLeave={() => setHoveredBenefit(null)}
                      className={`flex items-center gap-3 bg-[#0056A3] bg-opacity-10 backdrop-blur-sm rounded-xl p-4 text-white transition-all duration-500 cursor-pointer transform ${
                        isHovered
                          ? "bg-opacity-20 scale-105 shadow-xl translate-x-2"
                          : "bg-opacity-10 scale-100"
                      } ${isVisible ? "animate-fade-in-right" : "opacity-0"}`}
                      style={{
                        animationDelay: `${0.4 + idx * 0.1}s`,
                        border: isHovered
                          ? "2px solid rgba(255, 255, 255, 0.3)"
                          : "2px solid transparent",
                      }}
                    >
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-500 ${
                          isHovered
                            ? "bg-white scale-110 rotate-12"
                            : "bg-white/20"
                        }`}
                      >
                        <Check
                          className={`w-5 h-5 flex-shrink-0 transition-colors duration-300 ${
                            isHovered
                              ? "text-[#009846] animate-check-pop"
                              : "text-white"
                          }`}
                        />
                      </div>
                      <span
                        className={`text-lg transition-all duration-300 ${
                          isHovered ? "font-semibold" : "font-normal"
                        }`}
                      >
                        {benefit}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Simple variant
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
        @keyframes shimmerGradient {
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
        .animate-scale-in {
          animation: scaleIn 0.7s ease-out forwards;
        }
        .shimmer-button-simple {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 200% 100%;
          animation: shimmerGradient 2s infinite;
        }
      `}</style>

      <section
        ref={sectionRef}
        className="py-32 px-6 text-center bg-gray-50 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 -z-0"></div>

        <div className="max-w-3xl mx-auto relative z-10">
          <h2
            className={`text-5xl font-semibold text-gray-900 mb-6 ${
              isVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={{ animationDelay: "0.1s" }}
          >
            {title}
          </h2>
          <p
            className={`text-xl text-gray-600 mb-12 ${
              isVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={{ animationDelay: "0.2s" }}
          >
            {subtitle}
          </p>
          <button
            onClick={onButtonClick}
            className={`group relative bg-[#0056A3] text-white px-10 py-4 rounded-full hover:bg-[#004080] transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-2xl hover:scale-110 transform overflow-hidden ${
              isVisible ? "animate-scale-in" : "opacity-0"
            }`}
            style={{ animationDelay: "0.3s" }}
          >
            <span className="relative z-10">{buttonText}</span>
            <div className="absolute inset-0 shimmer-button-simple opacity-0 group-hover:opacity-100"></div>
          </button>

          {/* Decorative elements */}
          <div
            className={`mt-12 flex justify-center gap-2 ${
              isVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={{ animationDelay: "0.4s" }}
          >
            <div className="w-2 h-2 rounded-full bg-[#0056A3] animate-pulse"></div>
            <div className="w-16 h-2 rounded-full bg-gradient-to-r from-[#0056A3] to-[#009846]"></div>
            <div
              className="w-2 h-2 rounded-full bg-[#009846] animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>
        </div>
      </section>
    </div>
  );
}
