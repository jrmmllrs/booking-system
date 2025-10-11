import React, { useState, useEffect, useRef } from "react";
import { Star, Quote } from "lucide-react";

export default function TestimonialsSection({
  title = "What Our Patients Say",
  subtitle = "Real stories from real people",
  testimonials = [],
  autoRotate = true,
  rotateInterval = 5000,
}) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState("next");
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

  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      handleTestimonialChange(
        (currentTestimonial + 1) % testimonials.length,
        "next"
      );
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotateInterval, testimonials.length, currentTestimonial]);

  const handleTestimonialChange = (index, dir = "next") => {
    setIsTransitioning(true);
    setDirection(dir);
    setTimeout(() => {
      setCurrentTestimonial(index);
      setIsTransitioning(false);
    }, 300);
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
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideOutToLeft {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-30px);
          }
        }
        @keyframes slideOutToRight {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(30px);
          }
        }
        @keyframes starPop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
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
        .animate-scale-in {
          animation: scaleIn 0.7s ease-out forwards;
        }
        .animate-slide-in-from-right {
          animation: slideInFromRight 0.5s ease-out forwards;
        }
        .animate-slide-in-from-left {
          animation: slideInFromLeft 0.5s ease-out forwards;
        }
        .animate-slide-out-to-left {
          animation: slideOutToLeft 0.3s ease-out forwards;
        }
        .animate-slide-out-to-right {
          animation: slideOutToRight 0.3s ease-out forwards;
        }
        .animate-star-pop {
          animation: starPop 0.4s ease-out forwards;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .shimmer-bg {
          background: linear-gradient(
            90deg,
            rgba(0, 86, 163, 0.05) 0%,
            rgba(0, 86, 163, 0.15) 50%,
            rgba(0, 86, 163, 0.05) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>

      <section
        ref={sectionRef}
        id="testimonials"
        className="py-24 px-6 bg-white relative overflow-hidden"
      >
        {/* Background Decoration */}
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-30 -z-0 animate-pulse"
          style={{ animationDuration: "5s" }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-80 h-80 bg-green-50 rounded-full blur-3xl opacity-25 -z-0 animate-pulse"
          style={{ animationDuration: "6s" }}
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

          <div
            className={`bg-gray-50 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ${
              isVisible ? "animate-scale-in" : "opacity-0"
            }`}
            style={{ animationDelay: "0.3s" }}
          >
            {/* Animated shimmer background */}
            <div className="absolute inset-0 shimmer-bg opacity-50"></div>

            {/* Quote Icon */}
            <Quote className="w-12 h-12 text-[#0056A3]/20 absolute top-8 left-8 animate-float z-0" />

            <div
              className={`relative z-10 ${
                isTransitioning
                  ? direction === "next"
                    ? "animate-slide-out-to-left"
                    : "animate-slide-out-to-right"
                  : direction === "next"
                  ? "animate-slide-in-from-right"
                  : "animate-slide-in-from-left"
              }`}
            >
              {/* Stars */}
              <div className="flex mb-4 gap-1">
                {[...Array(testimonials[currentTestimonial]?.rating || 5)].map(
                  (_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-star-pop"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  )
                )}
              </div>

              {/* Content */}
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                "{testimonials[currentTestimonial]?.content}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0056A3] rounded-full flex items-center justify-center text-white font-semibold shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer">
                  {testimonials[currentTestimonial]?.initials}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 hover:text-[#0056A3] transition-colors duration-300">
                    {testimonials[currentTestimonial]?.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonials[currentTestimonial]?.role}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-8 relative z-10">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    handleTestimonialChange(
                      idx,
                      idx > currentTestimonial ? "next" : "prev"
                    )
                  }
                  className={`rounded-full transition-all duration-500 hover:scale-125 ${
                    idx === currentTestimonial
                      ? "bg-[#0056A3] w-8 h-2"
                      : "bg-gray-300 w-2 h-2 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

            {/* Decorative corner elements */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#0056A3]/5 to-transparent rounded-tl-full"></div>
            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-[#009846]/5 to-transparent rounded-br-full"></div>
          </div>

          {/* Progress bar for auto-rotation */}
          {autoRotate && (
            <div className="mt-6 max-w-md mx-auto">
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#0056A3] to-[#009846] rounded-full transition-all"
                  style={{
                    width: "100%",
                    animation: `progressBar ${rotateInterval}ms linear infinite`,
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <style>{`
          @keyframes progressBar {
            from {
              width: 0%;
            }
            to {
              width: 100%;
            }
          }
        `}</style>
      </section>
    </div>
  );
}
