"use client";
import { motion } from "framer-motion";

export default function NPLoading() {
  const nDuration = 0.8;
  const pDuration = 0.8;
  const delayBetween = 0.05;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1a1a1a]">
      <div className="relative flex items-center justify-center p-6">
        <motion.svg
          viewBox="0 0 120 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-32 h-16"
        >
          {/* N base - faint */}
          <path
            d="M5 55 V5 L35 55 V5"
            stroke="#4b0082"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* N torch */}
          <motion.path
            d="M5 55 V5 L35 55 V5"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="url(#gradient)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: nDuration,
              repeat: Infinity,
              repeatType: "loop",
            }}
          />

          {/* P base - faint */}
          <path
            d="M35 55 H50 V5 H80 Q90 5 80 30 H50"
            stroke="#4b0082"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* P torch */}
          <motion.path
            d="M35 55 H50 V5 H80 Q90 5 80 30 H50"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="url(#gradient)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: pDuration,
              delay: nDuration + delayBetween,
              repeat: Infinity,
              repeatType: "loop",
            }}
          />

          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="120" y2="0">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </motion.svg>
      </div>
    </div>
  );
}
