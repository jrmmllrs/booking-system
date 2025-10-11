import React, { useState, useEffect, useRef } from "react";

export default function TeamSection({
  title = "Meet Our Team",
  subtitle = "Expert dentists dedicated to your smile",
  teamMembers = [],
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredMember, setHoveredMember] = useState(null);
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

  return (
    <div>
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
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes shine {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.6s ease-out forwards;
        }
        .animate-zoom-in {
          animation: zoomIn 0.7s ease-out forwards;
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.7s ease-out forwards;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.7s ease-out forwards;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .image-shine {
          position: relative;
          overflow: hidden;
        }
        .image-shine::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 70%
          );
          transform: translateX(-100%) translateY(-100%) rotate(45deg);
        }
        .image-shine:hover::before {
          animation: shine 0.8s ease-in-out;
        }
      `}</style>

      <section 
        ref={sectionRef}
        id="team" 
        className="py-24 px-6 bg-white relative overflow-hidden"
      >
        {/* Background Decoration */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-40 -z-0"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-30 -z-0"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 
              className={`text-4xl md:text-5xl font-semibold text-gray-900 mb-4 ${
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

          <div className="grid md:grid-cols-4 gap-8">
            {teamMembers.map((member, idx) => {
              const isHovered = hoveredMember === idx;
              const isEven = idx % 2 === 0;
              
              return (
                <div 
                  key={idx} 
                  className={`text-center group ${
                    isVisible 
                      ? (isEven ? 'animate-slide-in-left' : 'animate-slide-in-right')
                      : 'opacity-0'
                  }`}
                  style={{animationDelay: `${0.3 + idx * 0.1}s`}}
                  onMouseEnter={() => setHoveredMember(idx)}
                  onMouseLeave={() => setHoveredMember(null)}
                >
                  <div 
                    className={`aspect-square rounded-2xl mb-6 overflow-hidden transition-all duration-500 transform image-shine ${
                      isHovered 
                        ? 'shadow-2xl scale-105 -translate-y-2' 
                        : 'shadow-md scale-100'
                    }`}
                    style={{
                      border: isHovered ? '3px solid #0056A3' : '3px solid transparent'
                    }}
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className={`w-full h-full object-cover transition-all duration-700 ${
                        isHovered ? 'scale-110 brightness-105' : 'scale-100'
                      }`}
                    />
                    
                    {/* Overlay gradient on hover */}
                    <div 
                      className={`absolute inset-0 bg-gradient-to-t from-[#0056A3]/80 via-transparent to-transparent transition-opacity duration-500 ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`}
                    ></div>
                  </div>

                  <div className={`transition-all duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-0'}`}>
                    <h3 
                      className={`text-lg font-semibold mb-1 transition-all duration-300 ${
                        isHovered ? 'text-[#0056A3] scale-105' : 'text-gray-900'
                      }`}
                    >
                      {member.name}
                    </h3>
                    <p 
                      className={`text-sm text-gray-600 mb-1 transition-all duration-300 ${
                        isHovered ? 'font-medium' : ''
                      }`}
                    >
                      {member.role}
                    </p>
                    <p 
                      className={`text-xs transition-all duration-300 ${
                        isHovered 
                          ? 'text-[#009846] font-semibold scale-105' 
                          : 'text-[#0056A3]'
                      }`}
                    >
                      {member.specialty}
                    </p>
                  </div>

                  {/* Decorative dots */}
                  <div className="flex justify-center gap-1 mt-4">
                    <div 
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        isHovered ? 'bg-[#0056A3] scale-150' : 'bg-gray-300'
                      }`}
                    ></div>
                    <div 
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 delay-75 ${
                        isHovered ? 'bg-[#009846] scale-150' : 'bg-gray-300'
                      }`}
                    ></div>
                    <div 
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 delay-150 ${
                        isHovered ? 'bg-[#0056A3] scale-150' : 'bg-gray-300'
                      }`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Decorative bottom accent */}
          <div 
            className={`mt-20 flex justify-center gap-2 ${
              isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{animationDelay: `${0.3 + teamMembers.length * 0.1}s`}}
          >
            <div className="w-2 h-2 rounded-full bg-[#0056A3] animate-pulse" style={{animationDuration: '2s'}}></div>
            <div className="w-16 h-2 rounded-full bg-gradient-to-r from-[#0056A3] to-[#009846]"></div>
            <div className="w-2 h-2 rounded-full bg-[#009846] animate-pulse" style={{animationDuration: '2s', animationDelay: '0.5s'}}></div>
          </div>
        </div>
      </section>
    </div>
  );
}