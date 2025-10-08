import React from "react";
import { ChevronRight } from "lucide-react";

export default function FAQSection({
  title = "Frequently Asked Questions",
  subtitle = "Got questions? We've got answers",
  faqs = [],
}) {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600">{subtitle}</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details key={idx} className="bg-gray-50 rounded-2xl p-6 group">
              <summary className="font-semibold text-gray-900 cursor-pointer flex items-center justify-between">
                {faq.question}
                <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition" />
              </summary>
              <p className="text-gray-600 mt-4 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
