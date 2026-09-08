"use client";
import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "np-subject-view-mode";
const MODES = ["default", "fun"];

const SubjectViewModeContext = createContext({
  mode: "default",
  setMode: () => {},
});

export function SubjectViewModeProvider({ children }) {
  const [mode, setModeState] = useState("default");

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

  const setMode = (next) => {
    if (!MODES.includes(next)) return;
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage failures (private browsing, etc.)
    }
  };

  return (
    <SubjectViewModeContext.Provider value={{ mode, setMode }}>
      {children}
    </SubjectViewModeContext.Provider>
  );
}

export function useSubjectViewMode() {
  return useContext(SubjectViewModeContext);
}
