export default function DesktopMenu({ scrollToSection, onLoginClick }) {
  const menuItems = ["home", "services", "about", "contact"];

  return (
    <div className="hidden md:flex items-center space-x-8">
      {menuItems.map((section) => (
        <button
          key={section}
          onClick={() => scrollToSection(section)}
          className="text-gray-700 hover:text-cyan-600 transition-colors font-medium capitalize"
        >
          {section}
        </button>
      ))}

      <button
        onClick={onLoginClick}
        className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg transition-all"
      >
        Login / Book Now
      </button>
    </div>
  );
}
