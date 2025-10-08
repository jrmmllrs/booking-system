import React, { useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";

export default function TestimonialsSection({
  title = "What Our Patients Say",
  subtitle = "Real stories from real people",
  testimonials = [],
  autoRotate = true,
  rotateInterval = 5000,
}) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotateInterval, testimonials.length]);

  return (
    <section id="testimonials" className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600">{subtitle}</p>
        </div>

        <div className="bg-gray-50 rounded-3xl p-8 md:p-12 relative">
          <Quote className="w-12 h-12 text-blue-200 absolute top-8 left-8" />

          <div className="relative z-10">
            <div className="flex mb-4">
              {[...Array(testimonials[currentTestimonial].rating)].map(
                (_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-yellow-400"
                  />
                )
              )}
            </div>

            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              "{testimonials[currentTestimonial].content}"
            </p>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {testimonials[currentTestimonial].initials}
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-sm text-gray-600">
                  {testimonials[currentTestimonial].role}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentTestimonial(idx)}
                className={`w-2 h-2 rounded-full transition ${
                  idx === currentTestimonial ? "bg-blue-600 w-8" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
