import { motion, AnimatePresence } from "framer-motion";

export default function MobileMenu({
  showMobileMenu,
  onClose,
  scrollToSection,
  onLoginClick,
}) {
  return (
    <AnimatePresence>
      {showMobileMenu && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-white border-t shadow-lg z-40"
        >
          <div className="px-4 py-4 space-y-3">
            {["home", "services", "about", "contact"].map((section) => (
              <button
                key={section}
                onClick={() => {
                  scrollToSection(section);
                  onClose(); // close after navigating
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-cyan-50 rounded-lg capitalize"
              >
                {section}
              </button>
            ))}

            <button
              onClick={() => {
                onLoginClick();
                onClose();
              }}
              className="block w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2.5 rounded-full font-semibold"
            >
              Login / Book Now
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
