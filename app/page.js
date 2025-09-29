"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Particles from "../components/effects/particles";
import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";

export default function Home() {
  const [dimensions, setDimensions] = useState({
    width: "100vw",
    height: "100vh",
  });

  const teamRef = useRef(null);
  const aboutRef = useRef(null);

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
        {
      name: "Sharvil Gharkar",
      img: "/avatar/Sharvil_Gharkar.jpg",
      linkedin: "https://www.linkedin.com/in/sharvil-gharkar-16767b2b5/",
      insta: "https://www.instagram.com/sharvilgharkar_/",
      github: "https://github.com/Sharvil0769",
    },
    {
      name: "Arya Chawan",
      img: "/avatar/Arya_Chawan.png",
      linkedin: "https://www.linkedin.com/in/arya-chawan-99b127303/",
      insta: "https://www.instagram.com/aryachawann/",
      github: "https://github.com/aryachawan",
    },
    {
      name: "Arhaan Bhiwandkar",
      img: "/avatar/Arhaan_Bhiwandkar.jpeg",
      linkedin: "https://www.linkedin.com/in/arhaan-bhiwandkar-583aaa233/",
      insta: "https://www.instagram.com/arhaanbhiwandkar/",
      github: "https://github.com/ArhaanB24",
    },
    {
      name: "Bevin Johnson",
      img: "/avatar/Bevin_Johnson.jpg",
      linkedin: "https://www.linkedin.com/in/bevinjhsn",
      insta: "https://www.instagram.com/bevin_one77/",
      github: "https://github.com/BevinJ",
    },
  ];

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full relative overflow-hidden bg-black text-purple-100">
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleCount={900}
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

      {/* Top-right About Us & Our Team buttons */}
      <div className="w-full flex justify-end px-6 pt-4 z-10 relative gap-3">
        <button
          onClick={() => scrollToSection(aboutRef)}
          className="group px-6 py-2 rounded-xl text-purple-100 border border-purple-400/10 shadow-inner transition-all duration-300 hover:shadow-[0_0_12px_rgba(139,92,246,0.5)] hover:scale-[1.03] hover:-rotate-1"
        >
          About Us
        </button>
        <button
          onClick={() => scrollToSection(teamRef)}
          className="group px-6 py-2 rounded-xl text-purple-100 border border-purple-400/10 shadow-inner transition-all duration-300 hover:shadow-[0_0_12px_rgba(139,92,246,0.5)] hover:scale-[1.03] hover:rotate-1"
        >
          Our Team
        </button>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 py-10 sm:py-12 md:py-16">
        <div className="relative border border-purple-400/10 shadow-[0_0_10px_rgba(139,92,246,0.2)] rounded-2xl p-6 md:p-8 text-center max-w-full before:absolute before:inset-0 before:rounded-2xl before:border before:border-purple-500/10 before:bg-gradient-to-tr before:from-purple-900/20 before:to-purple-600/10 before:blur-sm before:opacity-30 before:pointer-events-none">
          <p className="relative text-5xl md:text-9xl font-semibold md:font-bold tracking-tight text-white">
            notesportal
          </p>
        </div>

        <div className="mt-4 italic font-light text-lg text-center text-purple-200 opacity-80">
          <p>your hub for mpstme notes</p>
        </div>

        {/* Login & Sign-up buttons */}
        <div className="mt-6 flex flex-col md:flex-row gap-3 md:gap-6 text-lg">
          <Link
            href="/signup"
            className="group relative px-6 py-2 rounded-xl text-purple-100 border border-purple-400/10 shadow-inner transition-all duration-300 hover:shadow-[0_0_12px_rgba(139,92,246,0.5)] hover:scale-[1.03] hover:-rotate-1 flex items-center justify-center text-center"
          >
            Sign Up
          </Link>

          <Link
            href="/login"
            className="group relative px-6 py-2 rounded-xl text-purple-100 border border-purple-400/10 shadow-inner transition-all duration-300 hover:shadow-[0_0_12px_rgba(139,92,246,0.5)] hover:scale-[1.03] hover:rotate-1 flex items-center justify-center text-center"
          >
            Login
          </Link>
        </div>
      </div>
      {/* About Us Section */}
      <div
        ref={aboutRef}
        className="relative z-10 w-full py-16 px-4 sm:px-8 md:px-12 scroll-mt-15"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 text-center">
          About Us
        </h2>
        <p className="text-justify text-purple-200 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed px-4 sm:px-0 py-2 sm:py-0">
          NotesPortal is a web-based platform where students can easily share and access study materials. You can upload your notes under specific subject codes, making it simple for everyone to find what they need. All uploaded files are available to users, who can view, download, or save them to their favorites for quick access later. You can also add or remove subjects to keep everything personalized and organized. Built by students for students, NotesPortal makes studying and sharing notes simple, fast, and convenient.
        </p>
      </div>

      {/* Team Section */}
      <div
        ref={teamRef}
        id="team"
        className="relative z-10 w-full min-h-screen py-16 px-4 sm:px-8 md:px-12 scroll-mt-24"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-10 md:mb-12">
          Our team
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
              <h3 className="text-base sm:text-lg md:text-lg lg:text-xl font-bold text-white mb-1">
                {member.name}
              </h3>
              <p className="text-sm sm:text-sm md:text-sm lg:text-md text-purple-200 mb-2">
                {member.role || "Team Member"}
              </p>

              {/* Social Banner */}
              <div className="flex items-center justify-center gap-4 mt-2 bg-purple-900/20 rounded-xl px-4 py-2 w-full">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-100 hover:text-purple-300"
                >
                  <FaLinkedin size={20} />
                </a>
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-100 hover:text-purple-300"
                >
                  <FaGithub size={20} />
                </a>
                <a
                  href={member.insta}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-100 hover:text-purple-300"
                >
                  <FaInstagram size={20} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
