"use client";
import { useState, useEffect } from "react";
import { IsFileinFav } from "@/actions/other-actions";
import FavFormBtn from "./fav-from-btn";
import FileViewModal from "./subject-files/file-view-modal";
import { FiFileText } from "react-icons/fi";
import { FaFilePdf, FaFileWord, FaFilePowerpoint } from "react-icons/fa";

function FilePreview({ file, isMobile }) {
  if (file.filetype === "pdf" && !isMobile) {
    Icon = FaFilePdf;
    return (
      // TEMP PREVIEW REMOVED
      <div className="flex items-center justify-center w-full h-36 rounded-xl border border-purple-500/20 bg-purple-500/10 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.25)]">
        <Icon className="text-5xl text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
      </div>
    );
  }

  let Icon;
  switch (file.filetype) {
    case "doc":
    case "docx":
      Icon = FaFileWord;
      break;
    case "ppt":
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
    <div className="flex items-center justify-center w-full h-36 rounded-xl border border-purple-500/20 bg-purple-500/10 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.25)]">
      <Icon className="text-5xl text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
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
    ? <MobileFileCard file={file} userid={userid} src={src} viewMode={viewMode} isFav={isFav} setIsFav={setIsFav} />
    : <DesktopFileCard file={file} userid={userid} src={src} viewMode={viewMode} isFav={isFav} setIsFav={setIsFav} />;
}

// ✨ GlassCard now includes Spotlight effect
function GlassCard({ children, viewMode }) {
  const [coords, setCoords] = useState({ x: -200, y: -200 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setCoords({ x: -200, y: -200 })}
      className={`relative overflow-hidden rounded-2xl transition-transform duration-300 ${viewMode === "grid" ? "p-4" : "p-3"}`}
    >
      {/* Spotlight gradient following cursor */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(600px circle at ${coords.x}px ${coords.y}px, rgba(168,85,247,0.2), transparent 40%)`,
        }}
      />

      {/* Purple frosted glass base */}
      <div className="absolute inset-0 bg-purple-500/10 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.15)]" />

      {/* Subtle purple-blue gradient for depth */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 via-transparent to-indigo-500/10" />

      {/* Reflection light streak fixed at diagonal */}
      <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] rotate-12 bg-gradient-to-r from-purple-400/30 via-purple-200/5 to-transparent opacity-40 pointer-events-none" />

      <div className="relative z-10">{children}</div>
    </div>
  );
}

function MobileFileCard({ file, userid, src, viewMode, isFav, setIsFav }) {
  return (
    <GlassCard viewMode={viewMode}>
      {viewMode === "grid" && (
        <div className="flex flex-col w-full text-white">
          <div className="mb-4">
            <FilePreview file={file} isMobile={true} />
          </div>

          <div className="flex justify-end mb-2">
            <FavFormBtn isFav={isFav} setIsFav={setIsFav} fileid={file.id} userid={userid} src={src} />
          </div>

          <h2 className="text-lg font-medium tracking-wide mb-1 truncate text-purple-100">{file.filename}</h2>
          <p className="text-sm text-purple-200/80 mb-4 truncate">{file.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-sm text-purple-300/80 truncate">{file.uploaded_by}</span>
            <FileViewModal data={file} />
          </div>
        </div>
      )}

      {viewMode === "list" && (
        <div className="flex flex-row items-center justify-between w-full space-x-4 text-white">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <FiFileText className="text-2xl text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] flex-shrink-0" />
            <div className="min-w-0">
              <h2 className="text-lg font-bold tracking-wide truncate text-purple-100">{file.filename}</h2>
              <p className="text-sm text-purple-200/80 truncate">{file.description}</p>
              <span className="text-xs text-purple-300/80 truncate">{file.uploaded_by}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <FavFormBtn isFav={isFav} setIsFav={setIsFav} fileid={file.id} userid={userid} src={src} />
            <FileViewModal data={file} />
          </div>
        </div>
      )}
    </GlassCard>
  );
}

function DesktopFileCard({ file, userid, src, viewMode, isFav, setIsFav }) {
  return (
    <GlassCard viewMode={viewMode}>
      {viewMode === "grid" && (
        <div className="flex flex-col w-full text-white">
          <div className="mb-4">
            <FilePreview file={file} isMobile={false} />
          </div>

          <div className="flex justify-end mb-2">
            <FavFormBtn isFav={isFav} setIsFav={setIsFav} fileid={file.id} userid={userid} src={src} />
          </div>

          <h2 className="text-lg font-bold tracking-wide mb-1 truncate text-purple-100">{file.filename}</h2>
          <p className="text-sm text-purple-200/80 mb-4 truncate">{file.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-sm text-purple-300/80 truncate">{file.uploaded_by}</span>
            <FileViewModal data={file} />
          </div>
        </div>
      )}

      {viewMode === "list" && (
        <div className="flex flex-row items-center justify-between w-full space-x-4 text-white">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <FiFileText className="text-3xl text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] flex-shrink-0" />
            <div className="min-w-0">
              <h2 className="text-lg font-bold tracking-wide truncate text-purple-100">{file.filename}</h2>
              <p className="text-sm text-purple-200/80 truncate">{file.description}</p>
              <span className="text-xs text-purple-300/80 truncate">{file.uploaded_by}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <FavFormBtn isFav={isFav} setIsFav={setIsFav} userid={userid} src={src} />
            <FileViewModal data={file} />
          </div>
        </div>
      )}
    </GlassCard>
  );
}
