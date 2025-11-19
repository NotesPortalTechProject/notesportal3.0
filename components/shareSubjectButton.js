"use client";
import toast from "react-hot-toast";

export default function ShareSubjectButton({ subjectName }) {
  function copyToClipboard() {
    const link = `https://notesportal.tech/subject/${subjectName}`;

    navigator.clipboard.writeText(link)
      .then(() => toast.success("Link copied to clipboard"))
      .catch(() => toast.error("Failed to copy"));
  }

  return (
    <button
      onClick={copyToClipboard}
      className="mt-2 mb-4 ml-6 text-center text-xs bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded-xl transition-all"
    >
      share subject
    </button>
  );
}
