"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { generateCustomThemeVars, THEME_VAR_NAMES } from "@/lib/theme-colors";

const NAMED_THEMES = ["purple"];
const STORAGE_KEY = "np-theme";
const DEFAULT_CUSTOM_COLOR = "#a855f7";

const ThemeContext = createContext({
  theme: "purple",
  customColor: DEFAULT_CUSTOM_COLOR,
  setTheme: () => {},
  setCustomColor: () => {},
});

function applyNamedTheme(next) {
  THEME_VAR_NAMES.forEach((name) => document.documentElement.style.removeProperty(name));
  document.documentElement.setAttribute("data-theme", next);
}

function applyCustomTheme(hex) {
  const vars = generateCustomThemeVars(hex);
  document.documentElement.setAttribute("data-theme", "custom");
  Object.entries(vars).forEach(([name, value]) => {
    document.documentElement.style.setProperty(name, value);
  });
}

function persist(mode, customColor) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode, customColor }));
  } catch {
    // ignore storage failures (private browsing, etc.)
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("purple");
  const [customColor, setCustomColorState] = useState(DEFAULT_CUSTOM_COLOR);

  useEffect(() => {
    let stored;
    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch {
      stored = null;
    }
    if (!stored) return;
    if (NAMED_THEMES.includes(stored.mode)) {
      setThemeState(stored.mode);
    } else if (stored.mode === "custom" && stored.customColor) {
      setThemeState("custom");
      setCustomColorState(stored.customColor);
    }
  }, []);

  const setTheme = (next) => {
    if (!NAMED_THEMES.includes(next)) return;
    setThemeState(next);
    applyNamedTheme(next);
    persist(next, customColor);
  };

  const setCustomColor = (hex) => {
    setCustomColorState(hex);
    setThemeState("custom");
    applyCustomTheme(hex);
    persist("custom", hex);
  };

  return (
    <ThemeContext.Provider value={{ theme, customColor, setTheme, setCustomColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
