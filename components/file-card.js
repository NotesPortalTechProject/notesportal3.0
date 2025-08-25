"use client";
import { useState, useEffect } from "react";
import { IsFileinFav } from "@/actions/other-actions";
import FavFormBtn from "./fav-from-btn";
import FileViewModal from "./subject-files/file-view-modal";
import { FiFileText } from "react-icons/fi";

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
      className={`rounded-2xl p-4 shadow-lg border border-white/10 backdrop-blur-md text-white transition-all duration-300
        ${viewMode === "grid"
          ? "bg-gradient-to-b from-[#222] to-purple-900/60"
          : "bg-gradient-to-r from-[#222] to-purple-900/50 flex flex-row items-center justify-between p-3"
        }`}
    >
      {/* Grid view */}
      {viewMode === "grid" && (
        <div className="flex flex-col w-full">
          <div className="rounded-xl border border-white/15 p-4 mb-4 flex items-center justify-center">
            <p className="text-white/80 font-medium truncate w-full text-center">Click open to view</p>
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
      className={`rounded-2xl p-4 shadow-lg border border-white/10 backdrop-blur-md text-white transition-all duration-300
        ${viewMode === "grid"
          ? "bg-gradient-to-b from-[#222] to-purple-900/60"
          : "bg-gradient-to-r from-[#222] to-purple-900/50 flex flex-row items-center justify-between p-3"
        }`}
    >
      {/* Grid view */}
      {viewMode === "grid" && (
        <div className="flex flex-col w-full">
          <div className="overflow-hidden rounded-xl mb-4">
            <iframe src={file.filelink} title={file.filename} className="w-full h-35 rounded-xl border-0" loading="lazy" />
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
