import React from "react";
import { Heart, Menu, X } from "lucide-react";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";

const Navbar = ({
  showMobileMenu,
  onToggleMobileMenu,
  scrollToSection,
  onLoginClick,
}) => {
  return (
    <nav className="fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                SmileCare
              </h1>
              <p className="text-xs text-gray-500">Dental Clinic</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <DesktopMenu
            scrollToSection={scrollToSection}
            onLoginClick={onLoginClick}
          />

          {/* Mobile Menu Button */}
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden text-gray-700"
          >
            {showMobileMenu ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        showMobileMenu={showMobileMenu}
        onClose={() => onToggleMobileMenu()}
        scrollToSection={scrollToSection}
        onLoginClick={onLoginClick}
      />
    </nav>
  );
};

export default Navbar;