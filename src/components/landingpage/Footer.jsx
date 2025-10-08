import React from "react";

export default function Footer({
  clinicName = "Bright Smile",
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
  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="text-lg font-semibold mb-4">{clinicName}</div>
            <p className="text-sm text-gray-400 leading-relaxed">{tagline}</p>
          </div>

          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="hover:text-white transition">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {services.map((service, idx) => (
                <li key={idx}>{service}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {contactInfo.map((info, idx) => (
                <li key={idx}>{info}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {year} {clinicName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
