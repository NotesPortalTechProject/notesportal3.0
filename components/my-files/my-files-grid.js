"use client";
import { useState } from "react";
import FileCardWrapper from "../file-card";
import { FiGrid, FiList } from "react-icons/fi";

export default function MyFilesGrid({ data, userid, src }) {
  const [viewMode, setViewMode] = useState("grid");

  // Show message if no files
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-white mt-10">
        <p className="text-lg font-semibold">No recent files found</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 flex flex-col flex-1">
      {/* Toggle Buttons */}
      <div className="flex justify-end mb-4 space-x-2 sm:space-x-4">
        <button
          onClick={() => setViewMode("grid")}
          className={`transition-transform duration-300 transform hover:scale-110
            p-2 sm:p-3 rounded-lg 
            ${viewMode === "grid" ? "bg-purple-700 text-white" : "bg-[#1a1a1a]/50 text-gray-400 hover:bg-purple-600/70"}`}
        >
          <FiGrid className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`transition-transform duration-300 transform hover:scale-110
            p-2 sm:p-3 rounded-lg
            ${viewMode === "list" ? "bg-purple-700 text-white" : "bg-[#1a1a1a]/50 text-gray-400 hover:bg-purple-600/70"}`}
        >
          <FiList className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Files Container */}
      <div
        className={`flex-1 overflow-auto scrollbar-hide transition-all duration-500 ease-in-out ${
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-min" // prevent crumbling
            : "flex flex-col gap-4"
        }`}
      >
        {data.map((file, index) => (
          // Wrap each card in w-full to respect grid column width
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
