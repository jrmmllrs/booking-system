import React, { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar({
  brandName = "Diego Dental Clinic",
  menuItems = [
    { label: "Services", href: "#services" },
    { label: "Our Team", href: "#team" },
    { label: "Gallery", href: "#gallery" },
    { label: "Contact", href: "#contact" },
  ],
  onSignIn = () => {},
}) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <nav className="bg-white bg-opacity-80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-semibold text-gray-900">
              {brandName}
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="text-sm text-gray-600 hover:text-gray-900 transition"
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={onSignIn}
              className="text-sm text-blue-600 hover:text-blue-700 transition font-medium"
            >
              Sign In
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-gray-600"
          >
            {showMobileMenu ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden pb-4 border-t border-gray-100 mt-2 pt-4">
            {menuItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="block py-2 text-sm text-gray-600"
                onClick={() => setShowMobileMenu(false)}
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={() => {
                onSignIn();
                setShowMobileMenu(false);
              }}
              className="block w-full text-left py-2 text-sm text-blue-600 font-medium"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
