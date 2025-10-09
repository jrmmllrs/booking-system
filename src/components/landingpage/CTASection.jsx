import React from "react";
import { Check } from "lucide-react";

export default function CTASection({
  title = "Everything You Need for Perfect Dental Care",
  subtitle = "We make dental care accessible, affordable, and comfortable for everyone.",
  benefits = [],
  buttonText = "Get Started",
  onButtonClick = () => {},
  variant = "gradient", // "gradient" or "simple"
}) {
  if (variant === "gradient") {
    return (
      <section className="py-24 px-6 bg-gradient-to-br from-[#0056A3] to-[#004080] text-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-white">
                {title}
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed mb-8">
                {subtitle}
              </p>
              <button
                onClick={onButtonClick}
                className="bg-white text-[#0056A3] px-8 py-3.5 rounded-full hover:bg-gray-100 transition font-medium"
              >
                {buttonText}
              </button>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 text-[#0056A3]"
                >
                  <Check className="w-6 h-6 flex-shrink-0" />
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 px-6 text-center bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-5xl font-semibold text-gray-900 mb-6">{title}</h2>
        <p className="text-xl text-gray-600 mb-12">{subtitle}</p>
        <button
          onClick={onButtonClick}
          className="bg-[#0056A3] text-white px-10 py-4 rounded-full hover:bg-[#004080] transition font-medium text-lg"
        >
          {buttonText}
        </button>
      </div>
    </section>
  );
}
