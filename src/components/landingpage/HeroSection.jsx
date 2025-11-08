import { useState, useEffect } from "react";
import { Calendar, Shield, Award, Star, CheckCircle } from "lucide-react";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredStat, setHoveredStat] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { value: "15+", label: "Years Serving", icon: Award },
    { value: "10K+", label: "Happy Patients", icon: Star },
    { value: "24/7", label: "Emergency Care", icon: Shield },
  ];
  
  const features = [
    "PhilHealth & HMO Accepted",
    "DOH Licensed Dentists",
    "Flexible Payment Plans",
  ];

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-white min-h-screen">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes gradientShift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.15; }
          50% { transform: translate(30px, -30px) rotate(180deg); opacity: 0.25; }
        }
        @keyframes patternMove {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-slide-in-left { animation: slideInLeft 0.8s ease-out forwards; }
        .animate-slide-in-right { animation: slideInRight 0.8s ease-out forwards; }
        .animate-slide-in-up { animation: slideInUp 0.8s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.6s ease-out forwards; }
        .animate-gradient-shift { animation: gradientShift 20s ease-in-out infinite; }
        .pattern-dots {
          background-image: radial-gradient(circle, rgba(0, 86, 163, 0.08) 1px, transparent 1px);
          background-size: 30px 30px;
          animation: patternMove 60s linear infinite;
        }
        .pattern-grid {
          background-image: 
            linear-gradient(rgba(0, 86, 163, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 86, 163, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>

      {/* Multi-layer Background System */}
      <div className="absolute inset-0 pattern-dots" style={{ zIndex: 1 }}></div>
      <div className="absolute inset-0 pattern-grid" style={{ zIndex: 2 }}></div>
      
      {/* Gradient Orbs */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl animate-gradient-shift"
        style={{ 
          background: "radial-gradient(circle, rgba(0, 86, 163, 0.15) 0%, transparent 70%)",
          animationDelay: "0s",
          zIndex: 3
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl animate-gradient-shift"
        style={{ 
          background: "radial-gradient(circle, rgba(0, 152, 70, 0.12) 0%, transparent 70%)",
          animationDelay: "7s",
          zIndex: 3
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-[700px] h-[700px] rounded-full blur-3xl animate-gradient-shift"
        style={{ 
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)",
          animationDelay: "3.5s",
          zIndex: 3,
          transform: "translate(-50%, -50%)"
        }}
      />
      
      {/* Floating Shapes */}
      <div
        className="absolute top-20 w-32 h-32 rounded-2xl blur-2xl opacity-20 animate-pulse"
        style={{ 
          backgroundColor: "#0056A3", 
          animationDuration: "5s", 
          animationDelay: "1s",
          right: "25%",
          zIndex: 4
        }}
      />
      <div
        className="absolute bottom-32 w-24 h-24 rounded-full blur-2xl opacity-15 animate-pulse"
        style={{ 
          backgroundColor: "#009846", 
          animationDuration: "6s", 
          animationDelay: "2s",
          right: "33%",
          zIndex: 4
        }}
      />
      <div
        className="absolute top-1/3 left-20 w-40 h-40 rounded-3xl blur-2xl opacity-10 animate-pulse"
        style={{ 
          backgroundColor: "#0056A3", 
          animationDuration: "7s",
          zIndex: 4
        }}
      />
      
      {/* Subtle Mesh Gradient Overlay */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(at 20% 30%, rgba(0, 86, 163, 0.1) 0px, transparent 50%),
            radial-gradient(at 80% 70%, rgba(0, 152, 70, 0.08) 0px, transparent 50%),
            radial-gradient(at 50% 50%, rgba(59, 130, 246, 0.06) 0px, transparent 50%)
          `,
          zIndex: 5
        }}
      />

      <div className="max-w-7xl mx-auto relative" style={{ zIndex: 10 }}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className={isVisible ? "opacity-100" : "opacity-0"}>
            {/* Trust Badge */}
            <div
              className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full mb-8 border ${
                isVisible ? "animate-slide-in-left" : "opacity-0"
              }`}
              style={{
                color: "#0056A3",
                backgroundColor: "#E6F2FF",
                borderColor: "#0056A3",
                animationDelay: "0.1s",
              }}
            >
              <Star className="w-4 h-4 animate-pulse" style={{ fill: "#0056A3", animationDuration: "2s" }} />
              <span>Trusted by 10,000+ Filipino Families</span>
            </div>

            {/* Main Headline */}
            <h1
              className={`text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight ${
                isVisible ? "animate-slide-in-left" : "opacity-0"
              }`}
              style={{ animationDelay: "0.2s" }}
            >
              Your smile,
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(to right, #0056A3, #009846)",
                }}
              >
                our priority
              </span>
            </h1>

            {/* Description */}
            <p
              className={`text-xl text-gray-600 mb-8 leading-relaxed ${
                isVisible ? "animate-fade-in" : "opacity-0"
              }`}
              style={{ animationDelay: "0.3s" }}
            >
              Experience world-class dental care with our team of expert dentists. Serving Filipino families with compassion and excellence.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 mb-10">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 text-sm font-medium text-gray-700 bg-white px-4 py-2.5 rounded-full shadow-sm border border-gray-200 hover:shadow-md hover:scale-105 transition-all duration-300 ${
                    isVisible ? "animate-scale-in" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${0.4 + idx * 0.1}s` }}
                >
                  <CheckCircle className="w-4 h-4" style={{ color: "#009846" }} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 ${
                isVisible ? "animate-slide-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: "0.7s" }}
            >
              <button
                className="group flex items-center justify-center gap-2 text-white px-8 py-4 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transform"
                style={{ backgroundColor: "#0056A3" }}
              >
                <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Book Appointment</span>
              </button>
              <button
                className="flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-50 hover:scale-105 transition-all duration-300 font-semibold shadow-md border-2 transform"
                style={{ borderColor: "#0056A3", color: "#0056A3" }}
              >
                <span>View Services</span>
              </button>
            </div>
          </div>

          {/* Right Image Section */}
          <div
            className={`relative ${isVisible ? "animate-slide-in-right" : "opacity-0"}`}
            style={{ animationDelay: "0.3s" }}
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500 animate-float">
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop"
                alt="Modern dental clinic"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent" />
            </div>

            {/* Floating Badge - DOH Certified */}
            <div
              className={`absolute top-6 right-6 bg-white rounded-2xl px-5 py-3 shadow-xl backdrop-blur-sm hover:scale-110 transition-transform duration-300 ${
                isVisible ? "animate-scale-in" : "opacity-0"
              }`}
              style={{ animationDelay: "0.8s" }}
            >
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" style={{ color: "#0056A3" }} />
                <div>
                  <p className="text-xs font-bold text-gray-900">DOH Certified</p>
                  <p className="text-xs text-gray-600">Licensed Clinic</p>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div
              className="absolute -bottom-6 -right-6 w-32 h-32 rounded-3xl opacity-10 blur-xl animate-pulse"
              style={{
                background: "linear-gradient(to bottom right, #0056A3, #009846)",
                animationDuration: "3s",
                zIndex: -1
              }}
            />
            <div
              className="absolute -top-6 -left-6 w-24 h-24 rounded-3xl opacity-10 blur-xl animate-pulse"
              style={{
                background: "linear-gradient(to bottom right, #009846, #0056A3)",
                animationDuration: "4s",
                zIndex: -1
              }}
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredStat(idx)}
                onMouseLeave={() => setHoveredStat(null)}
                className={`bg-white rounded-2xl p-6 text-center hover:shadow-2xl transition-all duration-500 border border-gray-100 cursor-pointer transform ${
                  hoveredStat === idx ? "scale-110 -translate-y-2" : "scale-100"
                } ${isVisible ? "animate-slide-in-up" : "opacity-0"}`}
                style={{ animationDelay: `${1.0 + idx * 0.1}s` }}
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-all duration-500 ${
                    hoveredStat === idx ? "rotate-12 scale-110" : "rotate-0"
                  }`}
                  style={{ backgroundColor: "#E6F2FF" }}
                >
                  <Icon className="w-6 h-6" style={{ color: "#0056A3" }} />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}