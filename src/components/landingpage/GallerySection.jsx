import React from "react";

export default function GallerySection({
  title = "Our Clinic",
  subtitle = "Take a virtual tour of our modern facilities",
  images = [],
  onViewAll = () => {},
}) {
  return (
    <section id="gallery" className="py-24 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {images.map((image, idx) => (
            <div
              key={idx}
              className="aspect-video rounded-2xl overflow-hidden hover:shadow-lg transition cursor-pointer group"
            >
              <div className="relative w-full h-full">
                <img
                  src={image.image}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                  <p className="text-white font-medium">{image.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={onViewAll}
            className="bg-gray-900 text-white px-8 py-3.5 rounded-full hover:bg-gray-800 transition font-medium"
          >
            View Full Gallery
          </button>
        </div>
      </div>
    </section>
  );
}
