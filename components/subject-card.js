"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, MoreHorizontal } from "lucide-react";
import SpotlightCard from "./effects/spotlightcard"; // adjust path if needed

export default function SubjectCard({ subject, onRemove, id }) {
  const [showOptions, setShowOptions] = useState(false);
  const router = useRouter();

  return (
    <SpotlightCard
      spotlightColor="rgba(168, 85, 247, 0.15)"
      className="w-full h-36 sm:h-40 max-w-[13rem] sm:max-w-[15rem] cursor-pointer"
    >
      <div
        onClick={() => router.push(`/${id}/subject/${subject}`)}
        className="relative w-full h-full px-4 py-4 flex flex-col justify-center items-center rounded-3xl overflow-hidden group"
      >
        {/* Dropdown */}
        <div
          className="absolute top-2 right-2 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="text-white/60 hover:text-white p-1 rounded-full bg-white/5 hover:bg-white/10 transition"
            onClick={() => setShowOptions(!showOptions)}
          >
            <MoreHorizontal size={18} />
          </button>

          {showOptions && (
            <div className="absolute top-9 right-0 min-w-[7rem] sm:min-w-[8rem] md:min-w-[9rem] 
              bg-[#1a0a2d]/90 border border-purple-500/20 backdrop-blur-md rounded-xl z-30 p-1 
              shadow-[0_0_6px_rgba(168,85,247,0.05)]"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowOptions(false);
                  onRemove?.(subject);
                }}
                className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 text-left rounded-lg transition-all"
              >
                <Trash2 size={16} />
                <span className="truncate">Remove</span>
              </button>
            </div>
          )}
        </div>

        {/* Subject Name */}
        <p className="z-10 text-white-300 text-base sm:text-lg font-medium text-center tracking-tight leading-snug">
          {subject}
        </p>
      </div>
    </SpotlightCard>
  );
}
