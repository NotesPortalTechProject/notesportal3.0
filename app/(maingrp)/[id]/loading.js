"use client";
import { motion } from "framer-motion";

export default function NPLoading() {
  return (
    <div className="flex items-center justify-center min-h-[100vh] bg-[#1a1a1a]">
      <motion.svg
        className="w-32 h-16 sm:w-48 sm:h-24 stroke-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]"
        viewBox="0 0 120 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* N */}
        <motion.path
          d="M5 55 V5 L35 55 V5"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="url(#gradient)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 0.25,   // fast but visible
            repeat: Infinity,
            repeatType: "loop",
          }}
        />

        {/* P */}
        <motion.path
          d="M50 55 V5 H80 Q90 5 80 30 H50"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="url(#gradient)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 0.25,
            delay: 0.12, // starts shortly after N
            repeat: Infinity,
            repeatType: "loop",
          }}
        />

        {/* Gradient for neon effect */}
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="120" y2="0">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
}
