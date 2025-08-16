"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Particles from "../components/effects/particles";

export default function Home() {
  const [dimensions, setDimensions] = useState({
    width: "100vw",
    height: "100vh",
  });

  const teamRef = useRef(null);

  useEffect(() => {
    const updateSize = () => {
      setDimensions({
        width: `${window.innerWidth}px`,
        height: `${window.innerHeight}px`,
      });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const teamMembers = [
    { name: "Arya Chawan", img: "/avatar/Arya_Chawan.png" },
    { name: "Arhaan Bhiwandkar", img: "/avatar/Arhaan_Bhiwandkar.jpeg" },
    { name: "Bevin Johnson", img: "/avatar/Bevin_Johnson.jpg" },
    { name: "Sharvil Gharkar", img: "/avatar/Sharvil_Gharkar.jpg" },
  ];

  return (
    <div className="w-full relative overflow-hidden bg-black text-purple-100">
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleCount={600}
          particleSpread={12}
          speed={0.15}
          particleColors={["#a855f7", "#8b5cf6", "#c084fc", "#f5d0fe"]}
          moveParticlesOnHover={true}
          particleHoverFactor={4}
          alphaParticles={true}
          particleBaseSize={320}
          sizeRandomness={0.7}
          cameraDistance={35}
          disableRotation={false}
          className="pointer-events-none"
        />
      </div>

      <div className="absolute inset-0 z-0 animate-pulse bg-gradient-radial from-purple-900/10 via-transparent to-transparent opacity-20 pointer-events-none" />

      {/* Top-right About Us link */}
      <div className="w-full flex justify-end px-6 pt-4 z-10 relative">
        <a
          href="#team"
          onClick={(e) => {
            e.preventDefault();
            const teamSection = document.getElementById("team");
            if (teamSection) {
              teamSection.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="group px-6 py-2 rounded-xl text-purple-100 border border-purple-400/10 shadow-inner transition-all duration-300 hover:shadow-[0_0_12px_rgba(139,92,246,0.5)] hover:scale-[1.03] hover:-rotate-1"
        >
          About Us
        </a>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 py-10 sm:py-12 md:py-16">
        <div className="relative border border-purple-400/10 shadow-[0_0_10px_rgba(139,92,246,0.2)] rounded-2xl p-6 md:p-8 text-center max-w-full before:absolute before:inset-0 before:rounded-2xl before:border before:border-purple-500/10 before:bg-gradient-to-tr before:from-purple-900/20 before:to-purple-600/10 before:blur-sm before:opacity-30 before:pointer-events-none">
          <p className="relative text-5xl md:text-9xl font-semibold md:font-bold tracking-tight text-white">
            notesportal
          </p>
        </div>

        <div className="mt-4 italic font-light text-xl text-center text-purple-200 opacity-80">
          <p>your hub for mpstme notes</p>
        </div>

        {/* Login & Sign-up buttons */}
        <div className="mt-6 flex flex-col md:flex-row gap-3 md:gap-6 text-lg">
          <Link
            href="/signup"
            className="group relative px-6 py-2 rounded-xl text-purple-100 border border-purple-400/10 shadow-inner transition-all duration-300 hover:shadow-[0_0_12px_rgba(139,92,246,0.5)] hover:scale-[1.03] hover:-rotate-1"
          >
            Sign Up
          </Link>

          <Link
            href="/login"
            className="group relative px-6 py-2 rounded-xl text-purple-100 border border-purple-400/10 shadow-inner transition-all duration-300 hover:shadow-[0_0_12px_rgba(139,92,246,0.5)] hover:scale-[1.03] hover:rotate-1"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Team Section */}
     <div
  ref={teamRef}
  id="team"
  className="relative z-10 w-full min-h-screen py-16 px-4 sm:px-8 md:px-12 scroll-mt-24"
>
  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-10 md:mb-12">
    Our Team
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 max-w-6xl mx-auto">
    {teamMembers.map((member, index) => (
      <div
        key={index}
        className="relative group border border-purple-400/10 rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 flex flex-col items-center text-center transition-transform duration-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
      >
        <div className="w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 mb-4 border-2 border-purple-500/30 rounded-xl overflow-hidden shadow-[0_0_10px_rgba(168,85,247,0.2)] transition-all duration-500 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]">
          <img
            src={member.img}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-white mb-1">
          {member.name}
        </h3>
        <p className="text-sm sm:text-md md:text-md lg:text-lg text-purple-200">
          {member.role || "Team Member"}
        </p>
      </div>
    ))}
  </div>
</div>

    </div>
  );
}
