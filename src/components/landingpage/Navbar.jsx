import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "../../assets/diego-logo.png";

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
    <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt={brandName}
              className="h-14 w-auto"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
            <button
              onClick={onSignIn}
              className="text-sm bg-[#0056A3] text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all font-semibold hover:from-blue-700 hover:to-blue-800"
            >
              Book Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {showMobileMenu ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden pb-6 border-t border-gray-200 mt-2 pt-4 space-y-2">
            {menuItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="block py-3 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
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
              className="block w-full text-center py-3 text-sm bg-[#0056A3] text-white rounded-xl font-semibold hover:shadow-lg transition-all mt-4"
            >
              Book Now
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
