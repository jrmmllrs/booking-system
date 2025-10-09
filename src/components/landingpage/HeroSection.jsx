import React from "react";
import {
  Calendar,
  Shield,
  Award,
  Star,
  CheckCircle,
  Sparkles,
} from "lucide-react";

export default function HeroSection({
  title = "Your smile,",
  subtitle = "our priority",
  description = "Experience world-class dental care with our team of expert dentists. Serving Filipino families with compassion and excellence.",
  primaryAction = "Book Appointment",
  secondaryAction = "View Services",
  onPrimaryClick = () => {},
  onSecondaryClick = () => {},
  heroImage = "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop",
  stats = [
    { value: "15+", label: "Years Serving", icon: Award },
    { value: "10K+", label: "Happy Patients", icon: Star },
    { value: "24/7", label: "Emergency Care", icon: Shield },
  ],
  features = [
    "PhilHealth & HMO Accepted",
    "DOH Licensed Dentists",
    "Flexible Payment Plans",
  ],
}) {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      {/* Subtle Background Decoration */}
      <div className="absolute top-20 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 -z-10" style={{backgroundColor: '#0056A3'}}></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-15 -z-10" style={{backgroundColor: '#009846'}}></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full mb-8 border" style={{color: '#0056A3', backgroundColor: '#E6F2FF', borderColor: '#0056A3'}}>
              <Star className="w-4 h-4" style={{fill: '#0056A3'}} />
              <span>Trusted by 10,000+ Filipino Families</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              {title}
              <br />
              <span className="bg-clip-text text-transparent" style={{backgroundImage: 'linear-gradient(to right, #0056A3, #009846)'}}>
                {subtitle}
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {description}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 mb-10">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white px-4 py-2.5 rounded-full shadow-sm border border-gray-200"
                >
                  <CheckCircle className="w-4 h-4" style={{color: '#009846'}} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onPrimaryClick}
                className="flex items-center justify-center gap-2 text-white px-8 py-4 rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl hover:opacity-90"
                style={{backgroundColor: '#0056A3'}}
              >
                <Calendar className="w-5 h-5" />
                <span>{primaryAction}</span>
              </button>
              <button
                onClick={onSecondaryClick}
                className="flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all font-semibold shadow-md border-2"
                style={{borderColor: '#0056A3', color: '#0056A3'}}
              >
                <span>{secondaryAction}</span>
              </button>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="Modern dental clinic"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
            </div>

            {/* Floating Badge - DOH Certified */}
            <div className="absolute top-6 right-6 bg-white rounded-2xl px-5 py-3 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" style={{color: '#0056A3'}} />
                <div>
                  <p className="text-xs font-bold text-gray-900">
                    DOH Certified
                  </p>
                  <p className="text-xs text-gray-600">Licensed Clinic</p>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-3xl opacity-10 blur-xl -z-10" style={{background: 'linear-gradient(to bottom right, #0056A3, #009846)'}}></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 rounded-3xl opacity-10 blur-xl -z-10" style={{background: 'linear-gradient(to bottom right, #009846, #0056A3)'}}></div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 grid grid-cols-3 gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4" style={{backgroundColor: '#E6F2FF'}}>
                  <Icon className="w-6 h-6" style={{color: '#0056A3'}} />
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