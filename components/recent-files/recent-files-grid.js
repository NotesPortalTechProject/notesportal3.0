"use client";
import { useState } from "react";
import FileCardWrapper from "../file-card";
import { FiGrid, FiList } from "react-icons/fi";

export default function RecentFilesGrid({ data, weeks, userid, src }) {
  const [viewMode, setViewMode] = useState("grid");

  // Show message if no files available
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-white mt-10">
        <p className="text-lg font-semibold">No recent files found</p>
      </div>
    );
  }

  return (
    <div className="w-full px-6 flex flex-col flex-1">
      {/* Top bar: file count + view toggle */}
      <div className="flex flex-row items-center justify-between mb-4 gap-3">
        <p className="text-white/80 text-left truncate">
          Files uploaded in the last {weeks} weeks
        </p>

        {/* 🔥 Replaced with your new purple pill toggle */}
        <div
          className="
            w-36 sm:w-32 
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

          {/* Grid button */}
          <button
            onClick={() => setViewMode("grid")}
            className="relative z-10 w-1/2 text-center py-2 
                       text-[10px] sm:text-xs text-purple-200 hover:text-white"
          >
            <FiGrid className="mx-auto w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* List button */}
          <button
            onClick={() => setViewMode("list")}
            className="relative z-10 w-1/2 text-center py-2 
                       text-[10px] sm:text-xs text-purple-200 hover:text-white"
          >
            <FiList className="mx-auto w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* File cards container */}
      <div
        className={`flex-1 overflow-auto scrollbar-hide transition-all duration-500 ease-in-out ${
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-min"
            : "flex flex-col gap-4"
        }`}
        style={{ maxHeight: "calc(100vh - 250px)" }}
      >
        {data.slice(0, 9).map((file, index) => (
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
