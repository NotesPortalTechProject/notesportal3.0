"use client";
import toast from "react-hot-toast";

export default function ShareSubjectButton({ subjectName }) {
  function copyToClipboard() {
    const link = `https://notesportal.tech/subject/${subjectName}`;

    navigator.clipboard
      .writeText(link)
      .then(() => toast.success("Link copied to clipboard"))
      .catch(() => toast.error("Failed to copy"));
  }

  return (
    <button onClick={copyToClipboard} className="flex-shrink-0 ml-6 mt-2 mb-4">
      <div
        className="
          relative overflow-hidden rounded-xl
          px-4 py-2 text-xs md:text-sm font-medium
          transition-all backdrop-blur-md
          bg-gradient-to-r from-[#1a1a1a]/50 via-[#2a1a3d]/30 to-[#3d1f5e]/30
          text-purple-200
          border border-purple-500/10
          hover:border-purple-400/20
          hover:text-white
          hover:shadow-[0_0_4px_rgba(168,85,247,0.15)]
        "
      >
        <p className="truncate relative z-10">share subject</p>
        <div
          className="
            absolute inset-0 bg-gradient-to-tr
            from-white/5 via-transparent to-transparent
            opacity-30 -translate-x-full
            hover:translate-x-0
            transition-transform duration-100
          "
        ></div>
      </div>
    </button>
  );
}
