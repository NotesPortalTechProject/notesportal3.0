"use client";
import MagnetLines from "../components/MagnetLines";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-screen relative overflow-hidden bg-black">
      {/* Magnetic Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <MagnetLines
          rows={40}
          columns={40}
          lineColor="#a855f7"
          containerSize="100vw"
          lineWidth="0.4vmin"
          lineHeight="6vmin"
          baseAngle={-10}
        />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4">
        <div className="bg-black/40 backdrop-blur-md border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.2)] rounded-2xl p-6 md:p-8 text-center max-w-full">
          <p className="text-5xl md:text-9xl font-semibold text-purple-300 tracking-tight drop-shadow-[0_0_8px_#a855f7]">
            notesportal
          </p>
        </div>
        <div className="mt-4 text-purple-100 italic text-xl text-center">
          <p>your hub for mpstme notes</p>
        </div>
        <div className="mt-6 flex flex-col md:flex-row gap-3 md:gap-6 text-lg">
          <Link
            href="/signup"
            className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white border border-purple-300/30 shadow-md transition-all duration-200"
          >
            sign-up
          </Link>
          <Link
            href="/login"
            className="px-6 py-2 rounded-xl bg-purple-900/30 hover:bg-purple-900 text-purple-100 border border-purple-300/20 shadow-inner transition-all duration-200"
          >
            login
          </Link>
        </div>
      </div>
    </div>
  );
}
