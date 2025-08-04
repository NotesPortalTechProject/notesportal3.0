"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, MoreHorizontal } from "lucide-react";

export default function SubjectCard({ subject, onRemove, id }) {
  const [showOptions, setShowOptions] = useState(false);
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/${id}/subject/${subject}`)}
      className="relative w-full h-40 sm:h-48 max-w-[10rem] sm:max-w-sm flex flex-col justify-center items-center text-white font-medium text-base sm:text-lg rounded-2xl overflow-hidden 
      bg-[url('/bg_3.jpg')] bg-cover bg-center bg-blend-overlay 
      bg-gradient-to-b from-[#1a122d]/60 to-[#1a0a2d]/80 
      backdrop-blur-lg border border-purple-500/10 
      shadow-[0_0_10px_#a855f722] hover:shadow-[0_0_15px_#c084fcaa] 
      transition-all duration-300 ease-in-out hover:scale-[1.015] will-change-transform"
    >
      {/* Dropdown Trigger (top right) */}
      <div
        className="absolute top-2 right-2 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="text-white/70 hover:text-white p-1 rounded-full bg-[#1a0a2d]/60 hover:bg-[#2a1a3d]/70 transition"
          onClick={() => setShowOptions(!showOptions)}
        >
          <MoreHorizontal size={18} />
        </button>

        {showOptions && (
          <div className="absolute top-9 right-0 min-w-[7rem] sm:min-w-[8rem] md:min-w-[9rem] bg-[#1a0a2d]/90 backdrop-blur-md border border-purple-500/20 rounded-xl shadow-lg z-50 p-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowOptions(false);
                onRemove?.(subject);
              }}
              className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 text-left rounded-xl transition-all duration-200 ease-in-out"
            >
              <Trash2 size={16} />
              <span className="truncate">Remove</span>
            </button>
          </div>
        )}
      </div>

      {/* Subject Text */}
      <p className="z-10">{subject}</p>
    </div>
  );
}
