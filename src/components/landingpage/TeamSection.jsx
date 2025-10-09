import React from "react";

export default function TeamSection({
  title = "Meet Our Team",
  subtitle = "Expert dentists dedicated to your smile",
  teamMembers = [],
}) {
  return (
    <section id="team" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="text-center group">
              <div className="aspect-square rounded-2xl mb-6 overflow-hidden group-hover:shadow-lg transition">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {member.name}
              </h3>
              <p className="text-sm text-gray-600 mb-1">{member.role}</p>
              <p className="text-xs text-[#0056A3]">{member.specialty}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}