"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("An error occurred:", error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black via-purple-950 to-black" />
        <div className="backdrop-blur-xl bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a1a3d]/60 
                        border border-white/5 shadow-[0_0_30px_rgba(168,85,247,0.08)] 
                        rounded-2xl p-8 max-w-lg w-[90%] text-center">
          <h1 className="text-3xl font-bold text-purple-300 mb-4">Something went wrong</h1>
          <p className="text-sm text-white/80 mb-6">
            {error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => reset()}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg 
                       shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
