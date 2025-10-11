import React, { useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";

export default function FAQSection({
  title = "Frequently Asked Questions",
  subtitle = "Got questions? We've got answers",
  faqs = [],
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [hoveredFAQ, setHoveredFAQ] = useState(null);
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

  const toggleFAQ = (idx) => {
    setOpenFAQ(openFAQ === idx ? null : idx);
  };

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
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            max-height: 500px;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 1;
            max-height: 500px;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.6s ease-out forwards;
        }
        .animate-slide-down {
          animation: slideDown 0.4s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }
        .animate-pulse-custom {
          animation: pulse 2s ease-in-out infinite;
        }
        .faq-answer-enter {
          animation: slideDown 0.4s ease-out forwards;
        }
        .faq-answer-exit {
          animation: slideUp 0.3s ease-out forwards;
        }
        .shimmer-line {
          position: relative;
          overflow: hidden;
        }
        .shimmer-line::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(0, 86, 163, 0.2) 50%,
            transparent 100%
          );
          transform: translateX(-100%);
          animation: shimmer 2s infinite;
        }
      `}</style>

      <section
        ref={sectionRef}
        className="py-24 px-6 bg-white relative overflow-hidden"
      >
        {/* Background Decoration */}
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-40 -z-0 animate-pulse-custom"
          style={{ animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-80 h-80 bg-green-50 rounded-full blur-3xl opacity-30 -z-0 animate-pulse-custom"
          style={{ animationDuration: "5s" }}
        ></div>

        <div className="max-w-4xl mx-auto relative z-10">
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

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFAQ === idx;
              const isHovered = hoveredFAQ === idx;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredFAQ(idx)}
                  onMouseLeave={() => setHoveredFAQ(null)}
                  className={`bg-gray-50 rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer transform ${
                    isHovered
                      ? "shadow-xl scale-[1.02] bg-gray-100"
                      : "shadow-sm scale-100"
                  } ${isOpen ? "shadow-2xl bg-white" : ""} ${
                    isVisible ? "animate-fade-in-up" : "opacity-0"
                  }`}
                  style={{
                    animationDelay: `${0.3 + idx * 0.1}s`,
                    border: isOpen
                      ? "2px solid #0056A3"
                      : "2px solid transparent",
                  }}
                >
                  {/* Question Header */}
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full p-6 text-left"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span
                        className={`font-semibold transition-colors duration-300 ${
                          isOpen ? "text-[#0056A3]" : "text-gray-900"
                        }`}
                      >
                        {faq.question}
                      </span>

                      {/* Animated Icon Container */}
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                          isOpen
                            ? "bg-[#0056A3] rotate-90 scale-110"
                            : isHovered
                            ? "bg-[#0056A3]/20 rotate-0 scale-110"
                            : "bg-[#0056A3]/10 rotate-0 scale-100"
                        }`}
                      >
                        <ChevronRight
                          className={`w-5 h-5 transition-colors duration-300 ${
                            isOpen ? "text-white" : "text-[#0056A3]"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Progress line indicator */}
                    {isHovered && !isOpen && (
                      <div className="mt-4 h-0.5 bg-[#0056A3]/20 rounded-full shimmer-line"></div>
                    )}
                  </button>

                  {/* Answer Content */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div
                      className={`px-6 pb-6 ${
                        isOpen ? "faq-answer-enter" : ""
                      }`}
                    >
                      {/* Decorative line */}
                      <div className="h-px bg-gradient-to-r from-[#0056A3]/20 via-[#0056A3]/50 to-[#0056A3]/20 mb-4"></div>

                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>

                      {/* Optional: Add a helpful indicator */}
                      <div className="mt-4 flex items-center gap-2 text-sm text-[#009846]">
                        <div className="w-1.5 h-1.5 bg-[#009846] rounded-full animate-pulse-custom"></div>
                        <span className="font-medium">Was this helpful?</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom accent line when open */}
                  {isOpen && (
                    <div className="h-1 bg-gradient-to-r from-[#0056A3] via-[#009846] to-[#0056A3] animate-pulse-custom"></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div
            className={`mt-12 text-center ${
              isVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={{ animationDelay: `${0.3 + faqs.length * 0.1}s` }}
          >
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <button className="group text-[#0056A3] font-semibold flex items-center gap-2 mx-auto hover:gap-3 transition-all duration-300">
              <a href="#contact">
                <span>Contact Us</span>
              </a>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Decorative accent */}
          <div
            className={`mt-16 h-1 bg-gradient-to-r from-transparent via-[#0056A3]/30 to-transparent rounded-full ${
              isVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={{ animationDelay: `${0.4 + faqs.length * 0.1}s` }}
          ></div>
        </div>
      </section>
    </div>
  );
}
