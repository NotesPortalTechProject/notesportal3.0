"use client";
import { useState } from "react";
import FileCardWrapper from "../file-card";
import { FiGrid, FiList } from "react-icons/fi";

export default function MyFilesGrid({ data, userid, src, type }) {
  const [viewMode, setViewMode] = useState("grid");
  const [filetype, setFileType] = useState("all");
  let temp;
  if(type=='otheruser'){
    temp='Uploaded Files'
  }else if (type='myfiles'){
    temp='My Files'
  }

  // If no files
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-white mt-10">
        <p className="text-lg font-semibold">No files found</p>
      </div>
    );
  }

  const filetypesList = ["all", "pdfs", "docs", "ppts"];

  // Filter
  let filesdata = [...data];
  if (filetype === "pdfs") filesdata = data.filter((f) => f.filetype === "pdf");
  else if (filetype === "docs")
    filesdata = data.filter(
      (f) => f.filetype === "doc" || f.filetype === "docx"
    );
  else if (filetype === "ppts")
    filesdata = data.filter(
      (f) => f.filetype === "ppt" || f.filetype === "pptx"
    );

  return (
    <div className="w-full px-4 sm:px-6 flex flex-col flex-1">

      {/* Toggle  */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-white/90 text-base sm:text-xl font-semibold truncate px-2">
          {temp}
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

      {/* Filetype filter buttons */}
      <div className="w-full max-w-[90%] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[900px] flex items-center gap-3 mb-6 overflow-x-auto scrollbar-hide">
        {filetypesList.map((ft, idx) => (
          <button
            key={idx}
            onClick={() => setFileType(ft)}
            className="flex-shrink-0"
          >
            <div
              className={`relative overflow-hidden rounded-xl px-4 py-2 
                text-xs sm:text-sm md:text-base font-medium transition-all backdrop-blur-md ${filetype === ft
                  ? "bg-gradient-to-r from-[#2a0a3d]/70 via-[#4b0e63]/60 to-[#2a0a3d]/70 text-white border border-purple-400/30 shadow-[0_0_6px_rgba(168,85,247,0.25)]"
                  : "bg-gradient-to-r from-[#1a1a1a]/50 via-[#2a1a3d]/30 to-[#3d1f5e]/30 text-purple-200 border border-purple-500/10 hover:border-purple-400/20 hover:text-white hover:shadow-[0_0_4px_rgba(168,85,247,0.15)]"
                }`}
            >
              <p className="truncate relative z-10">{ft}</p>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-30 -translate-x-full hover:translate-x-0 transition-transform duration-500"></div>
            </div>
          </button>
        ))}
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
