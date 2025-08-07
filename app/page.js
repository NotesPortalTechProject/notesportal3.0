"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Particles from "../components/effects/particles"; // use correct path if different

export default function Home() {
  const [dimensions, setDimensions] = useState({
    width: "100vw",
    height: "100vh",
  });

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

  return (
    <div className="w-full h-screen relative overflow-hidden bg-black text-purple-100">
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleCount={600} // Reduced to improve clarity and performance
          particleSpread={12} // Tighter grouping
          speed={0.15} // Slower, calming movement
          particleColors={["#a855f7", "#8b5cf6", "#c084fc", "#f5d0fe"]} // Softer purples + lavender
          moveParticlesOnHover={true}
          particleHoverFactor={4} // Slightly stronger response on hover
          alphaParticles={true}
          particleBaseSize={320} // Slightly smaller
          sizeRandomness={0.7} // Less jittery
          cameraDistance={35} // Slightly farther back for smoother layout
          disableRotation={false}
          className="pointer-events-none"
        />
      </div>

      {/* Soft radial glow */}
      <div className="absolute inset-0 z-0 animate-pulse bg-gradient-radial from-purple-900/10 via-transparent to-transparent opacity-20 pointer-events-none" />

      {/* Foreground Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4">
        <div className="relative bg-black/50 backdrop-blur-md border border-purple-400/10 shadow-[0_0_10px_rgba(139,92,246,0.2)] rounded-2xl p-6 md:p-8 text-center max-w-full before:absolute before:inset-0 before:rounded-2xl before:border before:border-purple-500/10 before:bg-gradient-to-tr before:from-purple-900/20 before:to-purple-600/10 before:blur-sm before:opacity-30 before:pointer-events-none">
          <div className="relative">
            <div className="absolute -inset-12 bg-purple-500/10 blur-2xl rounded-full pointer-events-none" />
            <p className="relative text-5xl md:text-9xl font-semibold md:font-bold text-purple-200 tracking-tight drop-shadow-[0_0_4px_#8b5cf6]">
              notesportal
            </p>
          </div>
        </div>

        <div className="mt-4 italic font-light text-xl text-center text-purple-200 opacity-80">
          <p>your hub for mpstme notes</p>
        </div>

        <div className="mt-6 flex flex-col md:flex-row gap-3 md:gap-6 text-lg">
          <Link
            href="/signup"
            className="group relative px-6 py-2 rounded-xl bg-purple-900/30 text-purple-100 border border-purple-400/10 shadow-inner transition-all duration-300 hover:bg-purple-800 hover:shadow-[0_0_12px_rgba(139,92,246,0.5)] hover:scale-[1.03] hover:-rotate-1"
          >
            sign-up
          </Link>

          <Link
            href="/login"
            className="group relative px-6 py-2 rounded-xl bg-purple-900/30 text-purple-100 border border-purple-400/10 shadow-inner transition-all duration-300 hover:bg-purple-800 hover:shadow-[0_0_12px_rgba(139,92,246,0.5)] hover:scale-[1.03] hover:rotate-1"
          >
            login
          </Link>
        </div>
      </div>
    </div>
  );
}
