import React, { useState, useEffect, useRef } from "react";

export default function Footer({
  clinicName = "Diego Dental CLinic",
  tagline = "Your trusted partner for comprehensive dental care",
  quickLinks = [
    { label: "Services", href: "#services" },
    { label: "Our Team", href: "#team" },
    { label: "Gallery", href: "#gallery" },
    { label: "Contact", href: "#contact" },
  ],
  services = [
    "General Checkup",
    "Teeth Cleaning",
    "Dental Filling",
    "Emergency Care",
  ],
  contactInfo = [
    "(555) 123-4567",
    "hello@brightsmile.dental",
    "Mon-Fri: 9AM - 6PM",
  ],
  year = new Date().getFullYear(),
}) {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  return (
    <footer ref={footerRef} className="bg-[#0056A3] text-white py-12 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Clinic Info */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "0ms" }}
          >
            <div className="text-lg font-semibold mb-4 transition-transform duration-300 hover:scale-105">
              {clinicName}
            </div>
            <p className="text-sm text-white leading-relaxed">{tagline}</p>
          </div>

          {/* Quick Links */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <h4 className="font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white">
              {quickLinks.map((link, idx) => (
                <li
                  key={idx}
                  className={`transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: `${200 + idx * 50}ms` }}
                >
                  <a
                    href={link.href}
                    className="hover:text-white transition-all duration-300 inline-block hover:translate-x-1"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <h4 className="font-medium mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-white">
              {services.map((service, idx) => (
                <li
                  key={idx}
                  className={`transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: `${350 + idx * 50}ms` }}
                >
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "450ms" }}
          >
            <h4 className="font-medium mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-white">
              {contactInfo.map((info, idx) => (
                <li
                  key={idx}
                  className={`transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: `${500 + idx * 50}ms` }}
                >
                  {info}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div
          className={`border-t border-white pt-8 text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "650ms" }}
        >
          <p className="text-sm text-white">
            &copy; {year} {clinicName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}