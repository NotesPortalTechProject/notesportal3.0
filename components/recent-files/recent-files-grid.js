"use client";
import { useState } from "react";
import FileCardWrapper from "../file-card";
import { FiGrid, FiList } from "react-icons/fi";

export default function RecentFilesGrid({ data, weeks, userid, src }) {
  const [viewMode, setViewMode] = useState("grid");

  if (!data || data.length === 0) {
    return <div className="text-center text-white mt-10"><p className="text-lg font-semibold">No recent files found</p></div>;
  }

  return (
    <div className="w-full px-6 flex flex-col flex-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <p className="text-white/80 text-left">Files uploaded from last {weeks} weeks</p>
        <div className="flex justify-center sm:justify-end space-x-2 sm:space-x-3">
          <button
            onClick={() => setViewMode("grid")}
            className={`transition-transform duration-300 transform hover:scale-110 p-1.5 sm:p-2.5 rounded-lg ${
              viewMode === "grid"
                ? "bg-purple-700 text-white"
                : "bg-[#1a1a1a]/50 text-gray-400 hover:bg-purple-600/70"
            }`}
          >
            <FiGrid className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`transition-transform duration-300 transform hover:scale-110 p-1.5 sm:p-2.5 rounded-lg ${
              viewMode === "list"
                ? "bg-purple-700 text-white"
                : "bg-[#1a1a1a]/50 text-gray-400 hover:bg-purple-600/70"
            }`}
          >
            <FiList className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
      <div
        className={`flex-1 overflow-auto scrollbar-hide transition-all duration-500 ease-in-out ${
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "flex flex-col gap-4"
        }`}
        style={{ maxHeight: "calc(100vh - 250px)" }}
      >
        {data.slice(0, 9).map((file, index) => (
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
