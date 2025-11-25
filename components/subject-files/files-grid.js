"use client";
import { useState, useRef, useEffect } from "react";
import FileCardWrapper from "../file-card";
import { FiGrid, FiList, FiChevronDown, FiCheck } from "react-icons/fi";

export default function FilesGrid({ data, id, src }) {
  const [viewMode, setViewMode] = useState("grid");
  const [filetype, setFileType] = useState("all");

  // default sort
  const [sortMode, setSortMode] = useState("new");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const sortRef = useRef(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // Sorting
  if (sortMode === "az")
    filesdata.sort((a, b) => a.filename.localeCompare(b.filename));
  else if (sortMode === "za")
    filesdata.sort((a, b) => b.filename.localeCompare(a.filename));
  else if (sortMode === "new")
    filesdata.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  // default
  else if (sortMode === "old")
    filesdata.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  const sortOptions = [
    { key: "az", label: "A → Z" },
    { key: "za", label: "Z → A" },
    { key: "new", label: "Newest → Oldest" },
    { key: "old", label: "Oldest → Newest" },
  ];

  return (
    <>
      {/* Filetype filter buttons */}
      <div className="w-full pr-4 max-w-[90%] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[900px] flex items-center gap-3 mt-2 mb-2 ml-4 overflow-x-auto scrollbar-hide">
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

      {/* TOP BAR */}
      <div className="w-full px-4 sm:px-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4 gap-3">
          <p className="text-white/80">{filesdata.length} files available</p>

          <div className="flex items-center gap-3">
            {/* SORT BUTTON */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setSortMenuOpen(!sortMenuOpen)}
                className="
                  flex items-center gap-2 
                  px-2 py-2 sm:px-3 sm:py-2 
                  text-xs sm:text-sm
                  bg-white/5 backdrop-blur-md rounded-xl
                  border border-purple-500/20 text-purple-200
                  hover:border-purple-400/30 hover:text-white
                  transition-all
                "
              >
                <span className="hidden sm:block">Sort</span>
                <FiChevronDown className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </button>

              {sortMenuOpen && (
                <div
                  className="
                    absolute mt-2 
                    w-36 sm:w-44 
                    rounded-xl backdrop-blur-xl 
                    bg-gradient-to-b from-[#1a1a1a]/70 to-[#2a1a3d]/60
                    border border-purple-500/20 shadow-lg 
                    p-1 z-50

                    left-0 sm:left-auto
                    right-auto sm:right-0
                  "
                >
                  {sortOptions.map((item) => (
                    <div
                      key={item.key}
                      onClick={() => {
                        setSortMode(item.key);
                        setSortMenuOpen(false);
                      }}
                      className={`
                        px-3 py-2 
                        text-xs sm:text-sm 
                        rounded-lg cursor-pointer flex justify-between items-center
                        transition-all
                      ${sortMode === item.key
                          ? "bg-purple-500/5 text-purple-100 font-normal"
                          : "text-purple-200 hover:bg-white/10 hover:text-white"
                        }
                  `}
                    >
                      {item.label}

                      {sortMode === item.key && (
                        <FiCheck className="w-4 h-4 text-purple-300 opacity-90" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* VIEW TOGGLE */}
            <div
              className="
                w-24 sm:w-32 
                relative flex rounded-full overflow-hidden backdrop-blur-md
                bg-gradient-to-r from-[#1a1a1a]/50 via-[#2a1a3d]/30 to-[#3d1f5e]/30
                border border-purple-500/20 px-1 py-1 select-none
              "
            >
              <div
                className={`
                  absolute top-1 bottom-1 w-1/2 rounded-full
                  transition-all duration-300 ease-out
                  bg-gradient-to-r from-[#2a0a3d]/70 via-[#4b0e63]/60 to-[#2a0a3d]/70
                  border border-purple-400/30 shadow-[0_0_6px_rgba(168,85,247,0.25)]
                  ${viewMode === "grid" ? "left-1" : "left-1/2"}
                `}
              ></div>

              <button
                onClick={() => setViewMode("grid")}
                className="relative z-10 w-1/2 text-center py-2 text-[10px] sm:text-xs text-purple-200 hover:text-white"
              >
                <FiGrid className="mx-auto w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={() => setViewMode("list")}
                className="relative z-10 w-1/2 text-center py-2 text-[10px] sm:text-xs text-purple-200 hover:text-white"
              >
                <FiList className="mx-auto w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* FILE CARDS */}
        {filesdata.length != 0 && (
          <div
            className={`flex-1 overflow-auto scrollbar-hide transition-all duration-500 ease-in-out ${viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "flex flex-col gap-4"
              }`}
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
        )}
        {filesdata.length == 0 && (
          <div className="text-center text-white mt-10 space-y-2">
            <p className="text-lg font-semibold">No files available</p>
            <p className="text-sm opacity-75">
              Start uploading and share with everyone.
            </p>
            <p className="text-xs opacity-75 text-red-900">Check for typing error in subject code as well</p>
          </div>
        )}
      </div>
    </>
  );
}
