"use client";
import { useState } from "react";
import FileCardWrapper from "../file-card";
import { FiGrid, FiList } from "react-icons/fi";

export default function MyFilesGrid({ data, userid, src }) {
  const [viewMode, setViewMode] = useState("grid");

  // If no files
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-white mt-10">
        <p className="text-lg font-semibold">No files found</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 flex flex-col flex-1">

      {/* Toggle  */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-white/90 text-base sm:text-lg font-semibold truncate px-2">
          My Files
        </p>

        <div
          className="
            w-24 sm:w-32 
            relative flex rounded-full overflow-hidden backdrop-blur-md
            bg-gradient-to-r from-[#1a1a1a]/50 via-[#2a1a3d]/30 to-[#3d1f5e]/30
            border border-purple-500/20 px-1 py-1 select-none
          "
        >
          {/* Sliding highlight */}
          <div
            className={`
              absolute top-1 bottom-1 w-1/2 rounded-full
              transition-all duration-300 ease-out
              bg-gradient-to-r from-[#2a0a3d]/70 via-[#4b0e63]/60 to-[#2a0a3d]/70
              border border-purple-400/30 shadow-[0_0_6px_rgba(168,85,247,0.25)]
              ${viewMode === "grid" ? "left-1" : "left-1/2"}
            `}
          ></div>

          {/* Grid Button */}
          <button
            onClick={() => setViewMode("grid")}
            className="relative z-10 w-1/2 text-center py-2 text-[10px] sm:text-xs text-purple-200 hover:text-white"
          >
            <FiGrid className="mx-auto w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* List Button */}
          <button
            onClick={() => setViewMode("list")}
            className="relative z-10 w-1/2 text-center py-2 text-[10px] sm:text-xs text-purple-200 hover:text-white"
          >
            <FiList className="mx-auto w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* FILES GRID / LIST */}
      <div
        className={`flex-1 overflow-auto scrollbar-hide transition-all duration-500 ease-in-out ${
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-min"
            : "flex flex-col gap-4"
        }`}
      >
        {data.map((file, index) => (
          <div key={index} className="w-full">
            <FileCardWrapper
              file={file}
              index={index}
              userid={userid}
              src={src}
              viewMode={viewMode}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
