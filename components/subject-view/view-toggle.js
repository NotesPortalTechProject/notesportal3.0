"use client";
import { LayoutGrid, Sparkles } from "lucide-react";
import { useSubjectViewMode } from "./subject-view-mode-context";

export default function ViewToggle() {
  const { mode, setMode } = useSubjectViewMode();

  return (
    <div
      role="tablist"
      aria-label="Subject view mode"
      className="hidden md:inline-flex h-9 items-center gap-1 rounded-full p-1 border border-white/10 bg-[var(--theme-toast-bg)]/70 backdrop-blur-md"
    >
      <button
        type="button"
        role="tab"
        aria-selected={mode === "default"}
        onClick={() => setMode("default")}
        className={`flex h-7 items-center justify-center gap-1.5 px-2.5 sm:px-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
          mode === "default"
            ? "bg-[rgb(var(--theme-glow-500))] text-white shadow-[0_0_10px_rgb(var(--theme-glow-500)/0.5)]"
            : "text-white/60 hover:text-white"
        }`}
      >
        <LayoutGrid size={14} />
        <span>Default</span>
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === "fun"}
        onClick={() => setMode("fun")}
        className={`flex h-7 items-center justify-center gap-1.5 px-2.5 sm:px-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
          mode === "fun"
            ? "bg-[rgb(var(--theme-glow-500))] text-white shadow-[0_0_10px_rgb(var(--theme-glow-500)/0.5)]"
            : "text-white/60 hover:text-white"
        }`}
      >
        <Sparkles size={14} />
        <span>Fun</span>
      </button>
    </div>
  );
}
