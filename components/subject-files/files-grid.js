"use client";
import { useState } from "react";
import FileCardWrapper from "../file-card";
import { FiGrid, FiList } from "react-icons/fi";

export default function FilesGrid({ data, id, src }) {
  const [viewMode, setViewMode] = useState("grid");

  const [filetype, setFileType] = useState("all");
  const filetypesList = ["all", "pdfs", "docs", "ppts"];

  let filesdata;

  if (filetype === "all") {
    filesdata = data;
  } else if (filetype === "pdfs") {
    filesdata = data.filter(file => file.filetype === "pdf");
  } else if (filetype === "docs") {
    filesdata = data.filter(file => file.filetype === "doc" || file.filetype === "docx");
  } else if (filetype === "ppts") {
    filesdata = data.filter(file => file.filetype === "ppt" || file.filetype === "pptx");
  }

  if (!filesdata || filesdata.length === 0) {
    return (
      <>
        {/* Filetype buttons container aligned with file card width, left aligned */}
        <div className="w-full pr-4 max-w-[90%] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[900px] flex items-center gap-3 mt-2 mb-2 ml-4 overflow-x-auto scrollbar-hide">
          {filetypesList.map((ft, idx) => (
            <button key={idx} onClick={() => { setFileType(ft) }}
              className="flex-shrink-0"
            >
              <div
                className={`relative overflow-hidden rounded-xl px-4 py-2 text-sm md:text-base font-medium transition-all
                backdrop-blur-md
                ${filetype === ft
                    ? "bg-gradient-to-r from-[#2a0a3d]/70 via-[#4b0e63]/60 to-[#2a0a3d]/70 text-white border border-purple-400/30 shadow-[0_0_6px_rgba(168,85,247,0.25)]"
                    : "bg-gradient-to-r from-[#1a1a1a]/50 via-[#2a1a3d]/30 to-[#3d1f5e]/30 text-purple-200 border border-purple-500/10 hover:border-purple-400/20 hover:text-white hover:shadow-[0_0_4px_rgba(168,85,247,0.15)]"
                  }`}
              >
                <p className="truncate relative z-10">{ft}</p>

                {/* diagonal glass reflection effect (very subtle) */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-30 -translate-x-full hover:translate-x-0 transition-transform duration-500"></div>
              </div>
            </button>
          ))}
        </div>
        <div className="text-center text-white mt-10">
          <p className="text-lg font-semibold">Sorry, no files available right now!</p>
          <p className="text-sm opacity-75">Start uploading and share with everyone.</p>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Filetype buttons container aligned with file card width, left aligned */}
      <div className="w-full pr-4 max-w-[90%] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[900px] flex items-center gap-3 mt-2 mb-2 ml-4 overflow-x-auto scrollbar-hide">
        {filetypesList.map((ft, idx) => (
          <button key={idx} onClick={() => { setFileType(ft) }}
            className="flex-shrink-0"
          >
            <div
              className={`relative overflow-hidden rounded-xl px-4 py-2 text-sm md:text-base font-medium transition-all
                backdrop-blur-md
                ${filetype === ft
                  ? "bg-gradient-to-r from-[#2a0a3d]/70 via-[#4b0e63]/60 to-[#2a0a3d]/70 text-white border border-purple-400/30 shadow-[0_0_6px_rgba(168,85,247,0.25)]"
                  : "bg-gradient-to-r from-[#1a1a1a]/50 via-[#2a1a3d]/30 to-[#3d1f5e]/30 text-purple-200 border border-purple-500/10 hover:border-purple-400/20 hover:text-white hover:shadow-[0_0_4px_rgba(168,85,247,0.15)]"
                }`}
            >
              <p className="truncate relative z-10">{ft}</p>

              {/* diagonal glass reflection effect (very subtle) */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-30 -translate-x-full hover:translate-x-0 transition-transform duration-500"></div>
            </div>
          </button>
        ))}
      </div>
      <div className="w-full px-4 sm:px-6 flex flex-col flex-1">
        {/* Top bar: file count + view toggle */}
        <div className="flex items-center justify-between mb-4 gap-3">
          <p className="text-white/80 text-left">{data.length} files available</p>
          <div className="flex space-x-2 sm:space-x-3">
            <button
              onClick={() => setViewMode("grid")}
              className={`transition-transform duration-300 transform hover:scale-110 p-1.5 sm:p-2.5 rounded-lg ${viewMode === "grid"
                ? "bg-purple-700 text-white"
                : "bg-[#1a1a1a]/50 text-gray-400 hover:bg-purple-600/70"
                }`}
            >
              <FiGrid className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`transition-transform duration-300 transform hover:scale-110 p-1.5 sm:p-2.5 rounded-lg ${viewMode === "list"
                ? "bg-purple-700 text-white"
                : "bg-[#1a1a1a]/50 text-gray-400 hover:bg-purple-600/70"
                }`}
            >
              <FiList className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* File cards container */}
        <div
          className={`flex-1 overflow-auto scrollbar-hide transition-all duration-500 ease-in-out ${viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "flex flex-col gap-4"
            }`}
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          {filesdata.map((file, index) => (
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
    </>
  );
}
