"use client";
import { useState } from "react";
import FileCardWrapper from "../file-card";
import { FiGrid, FiList } from "react-icons/fi";

export default function FilesGrid({ data, id, src }) {
  const [viewMode, setViewMode] = useState("grid");

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-white mt-10">
        <p className="text-lg font-semibold">Sorry, no files available right now!</p>
        <p className="text-sm opacity-75">Start uploading and share with everyone.</p>
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
          <FiGrid className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`transition-transform duration-300 transform hover:scale-110
            p-2 sm:p-3 rounded-lg
            ${viewMode === "list" ? "bg-purple-700 text-white" : "bg-[#1a1a1a]/50 text-gray-400 hover:bg-purple-600/70"}`}
        >
          <FiList className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Files Container */}
      <div
        className={`flex-1 overflow-auto scrollbar-hide transition-all duration-500 ease-in-out ${
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "flex flex-col gap-4"
        }`}
        style={{ maxHeight: "calc(100vh - 200px)" }} // Adaptive height
      >
        {data.map((file, index) => (
          <FileCardWrapper
            key={index}
            file={file}
            index={index}
            userid={id}
            src={src}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
}
