'use client'
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaExternalLinkAlt, FaCopy } from "react-icons/fa";
import toast from "react-hot-toast";
import Image from "next/image";

export default function FileViewModal({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  function copyToClipboard(text) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => toast.success("link copied to clipboard"))
        .catch(() => toast.error("failed to copy"));
    }
  }

  function downloadFile(filename, filetype, subjectname) {
    const url = `/api/download?url=${encodeURIComponent(
      data.filelink
    )}&name=${encodeURIComponent(`${filename}.${filetype}`)}`;
    const link = document.createElement("a");
    link.href = url;
    link.click();
  }

  function modifyUrl(url) {
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes('.tech')) return url;

      parsed.hostname = parsed.hostname.replace('.live', '.tech');
      return parsed.toString();
    } catch {
      return url;
    }
  }

  function TasurLaaJaa() {
    const tasururl = new URL('https://tasur.anugrahshetty.dev/import');

    tasururl.searchParams.set('source', 'notesportal');
    const templink = modifyUrl(data.filelink)
    tasururl.searchParams.set('fileUrl', templink);
    tasururl.searchParams.set('sourceId', data.filename);
    tasururl.searchParams.set('title', data.filename);
    tasururl.searchParams.set('subject', data.subjectname);

    window.open(tasururl.toString(), "_blank");
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const modalContent = (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-7xl h-[90%] rounded-xl shadow-lg flex flex-col md:flex-row gap-4 overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20">
        <div className="flex-1 h-full">
          {/* Mobile: always show fallback */}
          <div className="md:hidden h-full flex items-center justify-center p-6">
            <div className="w-full h-full rounded-xl border border-white/15 bg-white/[0.06] flex flex-col items-center justify-center text-center px-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 opacity-80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8zm0 2.8L18.2 9H14zM8 13h8v2H8zm0 4h8v2H8zM8 9h4v2H8z" />
              </svg>
              <p className="text-white/80 font-medium">Open in new tab to check exact details</p>
            </div>
          </div>

          {/* Desktop: embed only for PDFs, else show fallback */}
          <div className="hidden md:block w-full h-full">
            {data.filetype === "pdf" ? (
              <embed
                src={data.filelink}
                type="application/pdf"
                className="w-full h-full rounded-lg"
              />
            ) : (
              <div className="w-full h-full rounded-xl border border-white/15 bg-white/[0.06] flex flex-col items-center justify-center text-center px-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-3 opacity-80 text-purple-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8zm0 2.8L18.2 9H14zM8 13h8v2H8zm0 4h8v2H8zM8 9h4v2H8z" />
                </svg>
                <p className="text-white/80 font-medium mb-2">
                  Preview not available for this file type
                </p>
                <p className="text-white/60 text-sm">
                  Please open in new tab to view full content
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-[30%] h-full flex flex-col p-5 rounded-lg text-white">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsOpen(false)}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-3 py-1 rounded-md transition-all"
            >
              Close
            </button>
          </div>

          <div className="space-y-4 text-[17px] flex-1 overflow-y-auto">
            <div>
              <p className="text-purple-400 font-semibold">Filename</p>
              <p className="truncate">{data.filename}</p>
            </div>
            <div>
              <p className="text-purple-400 font-semibold">Uploaded on</p>
              <p className="text-white/90">
                {new Date(data.created_at).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
            <div>
              <p className="text-purple-400 font-semibold">Description</p>
              <p className="text-sm">{data.description}</p>
            </div>
          </div>

          <div className="w-full flex flex-col gap-3">
            {/* Top row buttons */}
            <div className="flex w-full gap-2">
              <a
                href={`https://notesportal.tech/file/${data.filename}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-1/2 text-center text-base bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition-all"
              >
                Open in new tab
              </a>

              <button
                onClick={() =>
                  copyToClipboard(`https://notesportal.tech/file/${data.filename}`)
                }
                className="mt-4 w-1/2 text-center text-base bg-white/10 hover:bg-white/20 border border-purple-300 text-purple-200 py-2 px-4 rounded-md transition-all"
              >
                Copy link
              </button>
            </div>

            <button
              className="w-full inline-flex items-center justify-center gap-3 min-h-[48px] px-4 sm:px-5 py-3 bg-[#C2692A] text-white rounded-md cursor-pointer text-[14px] sm:text-[15px] font-semibold tracking-[0.01em] transition-all duration-150 ease-in-out hover:bg-[#B05D24]  active:translate-y-0"
              onClick={TasurLaaJaa}
            >
              <div className="flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap">

                <span className="text-white text-sm sm:text-[15px] font-medium whitespace-nowrap">
                  Study this with
                </span>

                <span
                  className="inline-flex items-center gap-[1px] text-white leading-none"
                  style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontSize: "clamp(17px, 2.5vw, 19px)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Tas
                  <Image
                    src="/logo.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="inline-block relative top-[-1px] shrink-0"
                  />
                  r
                </span>

              </div>
            </button>
          </div>

          <p className="mt-3 text-sm text-white/70">
            download may take a few seconds
          </p>
          <button
            onClick={() => downloadFile(data.filename, data.filetype, data.subjectname)}
            className="mt-1 w-full text-center text-base bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-all"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-purple-300 text-sm font-medium px-2 py-1 bg-white/5 rounded-md border border-purple-500/20"
      >
        Open
      </button>
      {isMounted && isOpen && createPortal(modalContent, document.body)}
    </>
  );
}
