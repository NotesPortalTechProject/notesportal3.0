"use client";
import { useState, useEffect } from "react";
import { IsFileinFav } from "@/actions/other-actions";
import FavFormBtn from "./fav-from-btn";
import FileViewModal from "./subject-files/file-view-modal";

export default function FileCardWrapper({ file, index, userid, src }) {
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile === null) return null; // Avoid mismatch before hydration

  return isMobile
    ? <MobileFileCard file={file} index={index} userid={userid} src={src} />
    : <DesktopFileCard file={file} index={index} userid={userid} src={src} />;
}

function MobileFileCard({ file, index, userid, src }) {
  const [isFav, setIsFav] = useState(false);
  useEffect(() => {
    IsFileinFav(file.id, userid).then(setIsFav);
  }, [file.id, userid]);

  return (
    <div key={index} className="rounded-2xl bg-gradient-to-b from-[#222] to-purple-900/60 p-4 shadow-lg border border-white/10 backdrop-blur-md text-white">
      <div className="rounded-xl border border-white/15 bg-white/[0.06] p-4 h-20 flex flex-col items-center justify-center text-center">
        <p className="text-white/80 font-medium">Click open to view</p>
      </div>
      <div className="w-full flex items-center justify-end">
        <FavFormBtn initialIsFav={isFav} fileid={file.id} userid={userid} src={src} />
      </div>
      <h2 className="text-lg font-bold tracking-wide mb-1 truncate w-full">{file.filename}</h2>
      <p className="text-sm text-gray-300 mb-4 truncate">{file.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/80">{file.uploaded_by}</span>
        <FileViewModal data={file} />
      </div>
    </div>
  );
}

function DesktopFileCard({ file, index, userid, src }) {
  const [isFav, setIsFav] = useState(false);
  useEffect(() => {
    IsFileinFav(file.id, userid).then(setIsFav);
  }, [file.id, userid]);

  return (
    <div key={index} className="rounded-2xl bg-gradient-to-b from-[#222] to-purple-900/60 p-4 shadow-lg border border-white/10 backdrop-blur-md text-white">
      <div className="overflow-hidden rounded-xl mb-4">
        <iframe src={file.filelink} title={file.filename} className="w-full h-45 rounded-xl border-0" loading="lazy" />
      </div>
      <div className="w-full flex items-center justify-end">
        <FavFormBtn initialIsFav={isFav} fileid={file.id} userid={userid} src={src} />
      </div>
      <h2 className="text-lg font-bold tracking-wide mb-1 truncate w-full">{file.filename}</h2>
      <p className="text-sm text-gray-300 mb-4 truncate">{file.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/80">{file.uploaded_by}</span>
        <FileViewModal data={file} />
      </div>
    </div>
  );
}
