"use client";
import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "np-subject-view-mode";
const MODES = ["default", "fun"];
const MOBILE_BREAKPOINT = 768;

const SubjectViewModeContext = createContext({
  mode: "default",
  setMode: () => {},
  isMobile: false,
});

export function SubjectViewModeProvider({ children }) {
  const [mode, setModeState] = useState("default");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let stored;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    if (MODES.includes(stored)) {
      setModeState(stored);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const setMode = (next) => {
    if (!MODES.includes(next)) return;
    if (next === "fun" && isMobile) return;
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage failures (private browsing, etc.)
    }
  };

  const effectiveMode = isMobile ? "default" : mode;

  return (
    <SubjectViewModeContext.Provider value={{ mode: effectiveMode, setMode, isMobile }}>
      {children}
    </SubjectViewModeContext.Provider>
  );
}

export function useSubjectViewMode() {
  return useContext(SubjectViewModeContext);
}
