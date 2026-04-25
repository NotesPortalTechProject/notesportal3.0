"use client";

import Link from "next/link";
import { FiArrowLeft, FiHome } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#0a0a0a] text-white">

      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />
      <div className="absolute w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-pink-500/10 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

      <div className="relative z-10 w-full max-w-lg p-8 rounded-2xl 
        backdrop-blur-xl bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a1a3d]/60
        border border-white/5 shadow-[0_0_40px_rgba(168,85,247,0.15)] text-center">

        <h1 className="text-9xl font-bold text-purple-300 mb-2">404</h1>
        <p className="text-lg text-white/80 mb-2">Page Not Found</p>
        <p className="text-sm text-white/50 mb-6">
          The page you're looking for doesn’t exist or was moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">

          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 
            px-4 py-2 rounded-md text-sm font-medium transition"
          >
            <FiHome />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 
            border border-white/10 px-4 py-2 rounded-md text-sm font-medium transition"
          >
            <FiArrowLeft />
            Go Back
          </button>

        </div>
      </div>
    </div>
  );
}