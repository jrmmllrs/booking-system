import React, { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function GallerySection({
  title = "Our Clinic",
  subtitle = "Take a virtual tour of our modern facilities",
  images = [],
}) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isFullGalleryOpen, setIsFullGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const openImageModal = (index) => {
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes modalFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.6s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.7s ease-out forwards;
        }
        .animate-modal-fade-in {
          animation: modalFadeIn 0.3s ease-out forwards;
        }
        .animate-modal-slide-up {
          animation: modalSlideUp 0.4s ease-out forwards;
        }
        .animate-pulse-custom {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* Main Section */}
      <section 
        ref={sectionRef}
        id="gallery" 
        className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
      >
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20 -z-0 animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-green-100 rounded-full blur-3xl opacity-20 -z-0 animate-pulse" style={{animationDuration: '5s'}}></div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 
              className={`text-4xl md:text-5xl font-bold text-gray-900 mb-3 ${
                isVisible ? 'animate-fade-in-down' : 'opacity-0'
              }`}
              style={{animationDelay: '0.1s'}}
            >
              {title}
            </h2>
            <p 
              className={`text-lg text-gray-600 ${
                isVisible ? 'animate-fade-in-down' : 'opacity-0'
              }`}
              style={{animationDelay: '0.2s'}}
            >
              {subtitle}
            </p>
          </div>

          {/* Grid Preview */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.slice(0, 6).map((image, idx) => {
              const isHovered = hoveredImage === idx;
              return (
                <div
                  key={idx}
                  onClick={() => openImageModal(idx)}
                  onMouseEnter={() => setHoveredImage(idx)}
                  onMouseLeave={() => setHoveredImage(null)}
                  className={`relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 transform ${
                    isHovered ? 'scale-105 -translate-y-1' : 'scale-100'
                  } ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
                  style={{
                    animationDelay: `${0.3 + idx * 0.1}s`,
                    border: isHovered ? '3px solid #0056A3' : '3px solid transparent'
                  }}
                >
                  <img
                    src={image.image}
                    alt={image.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
                      isHovered ? 'scale-110 brightness-110' : 'scale-100'
                    }`}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-all duration-500 flex items-end p-4 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <p className="text-white font-medium text-lg drop-shadow-md transform transition-transform duration-300" style={{
                      transform: isHovered ? 'translateY(0)' : 'translateY(10px)'
                    }}>
                      {image.title}
                    </p>
                  </div>

                  {/* Corner accent */}
                  <div 
                    className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#0056A3]/20 to-transparent transition-all duration-500 ${
                      isHovered ? 'w-24 h-24 opacity-100' : 'w-16 h-16 opacity-0'
                    }`}
                  ></div>

                  {/* Hover indicator */}
                  <div 
                    className={`absolute top-4 right-4 w-3 h-3 rounded-full bg-white transition-all duration-300 ${
                      isHovered ? 'scale-100 opacity-100 animate-pulse-custom' : 'scale-0 opacity-0'
                    }`}
                  ></div>
                </div>
              );
            })}
          </div>

          {/* View Full Gallery Button */}
          <div 
            className={`text-center mt-14 ${
              isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{animationDelay: `${0.3 + 6 * 0.1}s`}}
          >
            <button
              onClick={() => setIsFullGalleryOpen(true)}
              className="group bg-[#0056A3] text-white px-10 py-3.5 rounded-full hover:bg-[#004080] transition-all duration-300 font-medium text-lg shadow-md hover:shadow-xl hover:scale-105 transform relative overflow-hidden"
            >
              <span className="relative z-10">View Full Gallery</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>
        </div>
      </section>

      {/* Single Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6 animate-modal-fade-in">
          <button
            onClick={closeImageModal}
            className="absolute top-5 right-5 text-white hover:text-gray-300 transition-all duration-300 hover:rotate-90 hover:scale-110"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-6 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all duration-300 hover:scale-110 hover:-translate-x-1"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-6 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all duration-300 hover:scale-110 hover:translate-x-1"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="max-w-5xl w-full animate-modal-slide-up">
            <img
              src={images[currentImageIndex].image}
              alt={images[currentImageIndex].title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl shadow-2xl"
            />
            <div className="text-center mt-4">
              <h3 className="text-white text-xl font-semibold mb-1">
                {images[currentImageIndex].title}
              </h3>
              <p className="text-gray-400 text-sm tracking-wide">
                {currentImageIndex + 1} / {images.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Full Gallery Modal */}
      {isFullGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-start p-6 overflow-y-auto backdrop-blur-sm animate-modal-fade-in">
          {/* Close Button */}
          <button
            onClick={() => setIsFullGalleryOpen(false)}
            className="sticky top-4 right-6 self-end text-white hover:text-gray-300 transition-all duration-300 hover:rotate-90 hover:scale-110"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="max-w-7xl w-full mt-10">
            <h2 className="text-3xl font-semibold text-white text-center mb-10 animate-fade-in-down">
              Full Gallery
            </h2>

            {/* Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {images.map((image, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setIsFullGalleryOpen(false);
                    openImageModal(idx);
                  }}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer bg-gray-800 hover:shadow-2xl transition-all duration-500 hover:scale-105 transform animate-scale-in"
                  style={{animationDelay: `${idx * 0.05}s`}}
                >
                  <img
                    src={image.image}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-3">
                    <p className="text-white text-sm font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      {image.title}
                    </p>
                  </div>
                  
                  {/* Hover border effect */}
                  <div className="absolute inset-0 border-2 border-[#0056A3] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <button
                onClick={() => setIsFullGalleryOpen(false)}
                className="px-8 py-3.5 rounded-full bg-white text-gray-900 font-medium hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 transform"
              >
                Close Gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}