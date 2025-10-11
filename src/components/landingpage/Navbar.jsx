import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logo from "../../assets/transparent-logo.png";

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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger initial animation
    setIsVisible(true);
  }, []);

  return (
    <>
      <nav
        className={`bg-white/95 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm transition-all duration-700 ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div
              className={`flex items-center gap-3 transition-all duration-500 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-8 opacity-0"
              }`}
            >
              <img
                src={logo}
                alt={brandName}
                className="h-14 w-auto transition-transform duration-300 hover:scale-110"
                style={{ mixBlendMode: "multiply" }}
              />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {menuItems.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className={`text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 relative group ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "-translate-y-4 opacity-0"
                  }`}
                  style={{ transitionDelay: `${200 + idx * 100}ms` }}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-green-600 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
              <button
                onClick={onSignIn}
                className={`text-sm bg-[#0056A3] text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold hover:scale-105 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${200 + menuItems.length * 100}ms` }}
              >
                Book Now
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-8 opacity-0"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="relative w-6 h-6">
                <Menu
                  className={`w-6 h-6 absolute transition-all duration-300 ${
                    showMobileMenu
                      ? "rotate-90 opacity-0 scale-0"
                      : "rotate-0 opacity-100 scale-100"
                  }`}
                />
                <X
                  className={`w-6 h-6 absolute transition-all duration-300 ${
                    showMobileMenu
                      ? "rotate-0 opacity-100 scale-100"
                      : "-rotate-90 opacity-0 scale-0"
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-500 ${
              showMobileMenu ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div
              className={`pb-6 border-t border-gray-200 mt-2 pt-4 space-y-2 ${
                showMobileMenu ? "" : "invisible"
              }`}
            >
              {menuItems.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className={`block py-3 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300 ${
                    showMobileMenu
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-8 opacity-0"
                  }`}
                  style={{
                    transitionDelay: showMobileMenu ? `${idx * 50}ms` : "0ms",
                  }}
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
                className={`block w-full text-center py-3 text-sm bg-[#0056A3] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 mt-4 hover:scale-105 ${
                  showMobileMenu
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{
                  transitionDelay: showMobileMenu
                    ? `${menuItems.length * 50}ms`
                    : "0ms",
                }}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
