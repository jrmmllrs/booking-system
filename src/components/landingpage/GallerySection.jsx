import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function GallerySection({
  title = "Our Clinic",
  subtitle = "Take a virtual tour of our modern facilities",
  images = [],
}) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isFullGalleryOpen, setIsFullGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
      {/* Main Section */}
      <section id="gallery" className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              {title}
            </h2>
            <p className="text-lg text-gray-600">{subtitle}</p>
          </div>

          {/* Grid Preview */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.slice(0, 6).map((image, idx) => (
              <div
                key={idx}
                onClick={() => openImageModal(idx)}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <img
                  src={image.image}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-4">
                  <p className="text-white font-medium text-lg drop-shadow-md">
                    {image.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* View Full Gallery Button */}
          <div className="text-center mt-14">
            <button
              onClick={() => setIsFullGalleryOpen(true)}
              className="bg-[#0056A3] text-white px-10 py-3.5 rounded-full hover:bg-[#004080] transition font-medium text-lg shadow-md hover:shadow-lg"
            >
              View Full Gallery
            </button>
          </div>
        </div>
      </section>

      {/* Single Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6">
          <button
            onClick={closeImageModal}
            className="absolute top-5 right-5 text-white hover:text-gray-300 transition"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-6 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-6 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="max-w-5xl w-full">
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
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-start p-6 overflow-y-auto backdrop-blur-sm">
          {/* Close Button */}
          <button
            onClick={() => setIsFullGalleryOpen(false)}
            className="sticky top-4 right-6 self-end text-white hover:text-gray-300 transition"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="max-w-7xl w-full mt-10">
            <h2 className="text-3xl font-semibold text-white text-center mb-10">
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
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer bg-gray-800 hover:shadow-2xl transition-all duration-500"
                >
                  <img
                    src={image.image}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                    <p className="text-white text-sm font-medium">
                      {image.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <button
                onClick={() => setIsFullGalleryOpen(false)}
                className="px-8 py-3.5 rounded-full bg-white text-gray-900 font-medium hover:bg-gray-100 transition shadow-md"
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
