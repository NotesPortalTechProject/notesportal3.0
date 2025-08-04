"use client";
import { useEffect, useState } from "react";
import MagnetLines from "../components/effects/MagnetLines";
import Link from "next/link";

export default function Home() {
  const [grid, setGrid] = useState({
    rows: 20,
    columns: 20,
    width: "100vw",
    height: "100vh",
  });

  useEffect(() => {
    const calculateGrid = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const cellWidth = 30;  // adjust for density
      const cellHeight = 30;

      const columns = Math.floor(width / cellWidth);
      const rows = Math.floor(height / cellHeight);

      setGrid({
        columns,
        rows,
        width: `${width}px`,
        height: `${height}px`,
      });
    };

    calculateGrid();
    window.addEventListener("resize", calculateGrid);
    return () => window.removeEventListener("resize", calculateGrid);
  }, []);

  return (
    <div className="w-full h-screen relative overflow-hidden bg-black text-purple-100">
      {/* Magnetic Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <MagnetLines
          rows={grid.rows}
          columns={grid.columns}
          containerWidth={grid.width}
          containerHeight={grid.height}
          lineColor="#8b5cf6"
          lineWidth="0.4vmin"
          lineHeight="6vmin"
          baseAngle={-10}
        />
      </div>

      {/* Soft radial glow */}
      <div className="absolute inset-0 z-0 animate-pulse bg-gradient-radial from-purple-900/10 via-transparent to-transparent opacity-20 pointer-events-none" />

      {/* Foreground Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4">
        <div className="relative bg-black/50 backdrop-blur-md border border-purple-400/10 shadow-[0_0_10px_rgba(139,92,246,0.2)] rounded-2xl p-6 md:p-8 text-center max-w-full before:absolute before:inset-0 before:rounded-2xl before:border before:border-purple-500/10 before:bg-gradient-to-tr before:from-purple-900/20 before:to-purple-600/10 before:blur-sm before:opacity-30 before:pointer-events-none">
          <div className="relative">
            <div className="absolute -inset-12 bg-purple-500/10 blur-2xl rounded-full pointer-events-none" />
            <p className="relative text-5xl md:text-9xl font-semibold md:font-bold text-purple-200 tracking-tight drop-shadow-[0_0_4px_#8b5cf6]">
              notesportal
            </p>
          </div>
        </div>

        <div className="mt-4 italic font-light text-xl text-center text-purple-200 opacity-80">
          <p>your hub for mpstme notes</p>
        </div>

        <div className="mt-6 flex flex-col md:flex-row gap-3 md:gap-6 text-lg">
          <Link
            href="/signup"
            className="group relative px-6 py-2 rounded-xl bg-purple-900/30 text-purple-100 border border-purple-400/10 shadow-inner transition-all duration-300 hover:bg-purple-800 hover:shadow-[0_0_12px_rgba(139,92,246,0.5)] hover:scale-[1.03] hover:-rotate-1"
          >
            sign-up
          </Link>

          <Link
            href="/login"
            className="group relative px-6 py-2 rounded-xl bg-purple-900/30 text-purple-100 border border-purple-400/10 shadow-inner transition-all duration-300 hover:bg-purple-800 hover:shadow-[0_0_12px_rgba(139,92,246,0.5)] hover:scale-[1.03] hover:rotate-1"
          >
            login
          </Link>
        </div>
      </div>
    </div>
  );
}
