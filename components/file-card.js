"use client";
import { useState, useEffect } from "react";
import { IsFileinFav } from "@/actions/other-actions";
import FavFormBtn from "./fav-from-btn";
import FileViewModal from "./subject-files/file-view-modal";
import { FiFileText } from "react-icons/fi";
import { FaFilePdf, FaFileWord, FaFilePowerpoint } from "react-icons/fa";

function FilePreview({ file,isMobile }) {

  if (file.filetype === "pdf" && !isMobile) {
    return (
      <iframe
        src={file.filelink}
        title={file.filename}
        className="w-full h-36 rounded-xl border-0"
        loading="lazy"
      />
    );
  }

  let Icon;
  switch (file.filetype) {
    case "doc":
      Icon = FaFileWord;
      break;
    case "docx":
      Icon = FaFileWord;
      break;
    case "ppt":
      Icon = FaFilePowerpoint;
      break;
    case "pptx":
      Icon = FaFilePowerpoint;
      break;
    case "pdf":
      Icon = FaFilePdf;
      break;
    default:
      Icon = FiFileText;
      break;
  }

  return (
    <div className="flex items-center justify-center w-full h-36 rounded-xl border border-white/15 bg-[#1e1e1e]">
      <Icon className="text-5xl text-purple-400" />
    </div>
  );
}

export default function FileCardWrapper({ file, index, userid, src, viewMode = "grid" }) {
  const [isMobile, setIsMobile] = useState(null);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    IsFileinFav(file.id, userid).then(setIsFav);
  }, [file.id, userid]);

  if (isMobile === null) return null;

  return isMobile
    ? <MobileFileCard file={file} userid={userid} src={src} viewMode={viewMode} isFav={isFav} />
    : <DesktopFileCard file={file} userid={userid} src={src} viewMode={viewMode} isFav={isFav} />;
}

function MobileFileCard({ file, userid, src, viewMode, isFav }) {
  return (
    <div
      key={file.id}
      className={`rounded-2xl p-4 
  backdrop-blur-xl 
  bg-gradient-to-r from-purple-200/20 via-purple-500/15 to-purple-900/20
  border border-white/10 
  shadow-[0_0_25px_rgba(0,0,0,0.4),0_0_15px_rgba(168,85,247,0.25)]
  hover:shadow-[0_0_35px_rgba(0,0,0,0.6),0_0_25px_rgba(168,85,247,0.45)]
  hover:border-purple-400/40
  transition-all duration-300
  text-white
  ${viewMode === "grid"
          ? "flex flex-col"
          : "flex flex-row items-center justify-between p-3"
        }`}

    >
      {/* Grid view */}
      {viewMode === "grid" && (
        <div className="flex flex-col w-full">
          <div className="mb-4">
            <FilePreview file={file} isMobile={true}/>
          </div>

          <div className="flex justify-end mb-2">
            <FavFormBtn initialIsFav={isFav} fileid={file.id} userid={userid} src={src} />
          </div>

          <h2 className="text-lg font-medium tracking-wide mb-1 truncate">{file.filename}</h2>
          <p className="text-sm text-gray-300 mb-4 truncate">{file.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-sm text-white/80 truncate">{file.uploaded_by}</span>
            <FileViewModal data={file} />
          </div>
        </div>
      )}

      {/* List view */}
      {viewMode === "list" && (
        <div className="flex flex-row items-center justify-between w-full space-x-4">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <FiFileText className="text-2xl text-purple-400 flex-shrink-0" />
            <div className="min-w-0">
              <h2 className="text-lg font-bold tracking-wide truncate">{file.filename}</h2>
              <p className="text-sm text-gray-300 truncate">{file.description}</p>
              <span className="text-xs text-white/80 truncate">{file.uploaded_by}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <FavFormBtn initialIsFav={isFav} fileid={file.id} userid={userid} src={src} />
            <FileViewModal data={file} />
          </div>
        </div>
      )}
    </div>
  );
}

function DesktopFileCard({ file, userid, src, viewMode, isFav }) {
  return (
    <div
      key={file.id}
      className={`rounded-2xl p-4 
  backdrop-blur-xl 
  bg-gradient-to-r from-purple-200/20 via-purple-500/15 to-purple-900/20
  border border-white/10 
  shadow-[0_0_25px_rgba(0,0,0,0.4),0_0_15px_rgba(168,85,247,0.25)]
  hover:shadow-[0_0_35px_rgba(0,0,0,0.6),0_0_25px_rgba(168,85,247,0.45)]
  hover:border-purple-400/40
  transition-all duration-300
  text-white
  ${viewMode === "grid"
          ? "flex flex-col"
          : "flex flex-row items-center justify-between p-3"
        }`}
    >
      {/* Grid view */}
      {viewMode === "grid" && (
        <div className="flex flex-col w-full">
          <div className="mb-4">
            <FilePreview file={file} isMobile={false}/>
          </div>

          <div className="flex justify-end mb-2">
            <FavFormBtn initialIsFav={isFav} fileid={file.id} userid={userid} src={src} />
          </div>

          <h2 className="text-lg font-bold tracking-wide mb-1 truncate">{file.filename}</h2>
          <p className="text-sm text-gray-300 mb-4 truncate">{file.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-sm text-white/80 truncate">{file.uploaded_by}</span>
            <FileViewModal data={file} />
          </div>
        </div>
      )}

      {/* List view */}
      {viewMode === "list" && (
        <div className="flex flex-row items-center justify-between w-full space-x-4">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <FiFileText className="text-3xl text-purple-400 flex-shrink-0" />
            <div className="min-w-0">
              <h2 className="text-lg font-bold tracking-wide truncate">{file.filename}</h2>
              <p className="text-sm text-gray-300 truncate">{file.description}</p>
              <span className="text-xs text-white/80 truncate">{file.uploaded_by}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <FavFormBtn initialIsFav={isFav} fileid={file.id} userid={userid} src={src} />
            <FileViewModal data={file} />
          </div>
        </div>
      )}
    </div>
  );
}