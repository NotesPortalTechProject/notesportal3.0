"use client";
import { useState } from "react";
import FileCardWrapper from "../file-card";
import { FiGrid, FiList } from "react-icons/fi"; // Icons for toggle

export default function RecentFilesGrid({ data, weeks, userid, src }) {
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-white mt-10">
        <p className="text-lg font-semibold">No recent files found</p>
      </div>
    );
  }

  return (
    <div className="w-full px-6">
      {/* Info */}
      <div className="mb-4">
        <p className="text-white/80">Files uploaded from last {weeks} weeks</p>
      </div>

      {/* Toggle Buttons */}
      <div className="flex justify-end mb-4 space-x-2">
        <button
          onClick={() => setViewMode("grid")}
          className={`p-2 rounded-lg transition-all duration-300 ${
            viewMode === "grid"
              ? "bg-purple-700 text-white"
              : "bg-[#1a1a1a]/50 text-gray-400 hover:bg-purple-600/70"
          }`}
        >
          <FiGrid size={20} />
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`p-2 rounded-lg transition-all duration-300 ${
            viewMode === "list"
              ? "bg-purple-700 text-white"
              : "bg-[#1a1a1a]/50 text-gray-400 hover:bg-purple-600/70"
          }`}
        >
          <FiList size={20} />
        </button>
      </div>

      {/* Files */}
      <div
        className={`${
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "flex flex-col gap-4"
        } overflow-auto scrollbar-hide`}
        style={{ maxHeight: "70vh" }} // optional scroll area height
      >
        {data.map((file, index) => (
          <FileCardWrapper
            key={index}
            file={file}
            index={index}
            userid={userid}
            src={src}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
}
