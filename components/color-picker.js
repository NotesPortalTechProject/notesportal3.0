"use client";
import { useState, useRef, useEffect, useCallback } from "react";

function hsvToHex(h, s, v) {
  const sf = s / 100;
  const vf = v / 100;
  const c = vf * sf;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = vf - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (n) => Math.round((n + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToHsv(hex) {
  const clean = (hex || "#a855f7").replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = 60 * (((g - b) / d) % 6);
    else if (max === g) h = 60 * ((b - r) / d + 2);
    else h = 60 * ((r - g) / d + 4);
  }
  if (h < 0) h += 360;
  const s = max === 0 ? 0 : (d / max) * 100;
  const v = max * 100;
  return { h, s, v };
}

const isValidHex = (v) => /^#[0-9a-fA-F]{6}$/.test(v);

export default function ColorPicker({ initialColor, onChange, onClose }) {
  const [hsv, setHsv] = useState(() => hexToHsv(initialColor));
  const [hexInput, setHexInput] = useState(initialColor || "#a855f7");
  const svRef = useRef(null);
  const hueRef = useRef(null);
  const containerRef = useRef(null);

  const hex = hsvToHex(hsv.h, hsv.s, hsv.v);

  useEffect(() => {
    setHexInput(hex);
    onChange?.(hex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hsv]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose?.();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const updateFromSvPointer = useCallback((clientX, clientY) => {
    const rect = svRef.current.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    setHsv((prev) => ({ ...prev, s: x * 100, v: (1 - y) * 100 }));
  }, []);

  const updateFromHuePointer = useCallback((clientX) => {
    const rect = hueRef.current.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setHsv((prev) => ({ ...prev, h: x * 360 }));
  }, []);

  const startDrag = (moveHandler) => (e) => {
    e.preventDefault();
    moveHandler(e.clientX, e.clientY);
    const onMove = (ev) => moveHandler(ev.clientX, ev.clientY);
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const handleHexChange = (e) => {
    const v = e.target.value;
    setHexInput(v);
    const normalized = v.startsWith("#") ? v : `#${v}`;
    if (isValidHex(normalized)) {
      setHsv(hexToHsv(normalized));
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute z-[60] top-full right-0 mt-2 w-56 p-3.5 rounded-2xl bg-[#161018] border border-white/10 shadow-2xl"
    >
      <div
        ref={svRef}
        onPointerDown={startDrag(updateFromSvPointer)}
        className="relative w-full h-32 rounded-xl cursor-crosshair select-none"
        style={{
          background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), hsl(${hsv.h}, 100%, 50%)`,
        }}
      >
        <div
          className="absolute w-4 h-4 rounded-full border-2 border-white shadow-[0_0_4px_rgba(0,0,0,0.6)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${hsv.s}%`, top: `${100 - hsv.v}%`, backgroundColor: hex }}
        />
      </div>

      <div
        ref={hueRef}
        onPointerDown={startDrag((x) => updateFromHuePointer(x))}
        className="relative w-full h-3 rounded-full mt-3.5 cursor-pointer select-none"
        style={{
          background:
            "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
        }}
      >
        <div
          className="absolute top-1/2 w-4 h-4 rounded-full border-2 border-white shadow-[0_0_4px_rgba(0,0,0,0.6)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${(hsv.h / 360) * 100}%`, backgroundColor: `hsl(${hsv.h}, 100%, 50%)` }}
        />
      </div>

      <div className="flex items-center gap-2 mt-3.5">
        <div
          className="w-8 h-8 rounded-lg border border-white/15 flex-shrink-0"
          style={{ backgroundColor: hex }}
        />
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-wider text-white/35 mb-1">Hex</p>
          <input
            type="text"
            value={hexInput}
            onChange={handleHexChange}
            maxLength={7}
            spellCheck={false}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs font-mono uppercase text-white focus:outline-none focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/30 transition"
          />
        </div>
      </div>
    </div>
  );
}
