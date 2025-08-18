"use client";
import { useState, useRef, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import ProfileModal from "../profile-modal";

export default function HorizontalNavbar({ id }) {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);
  const desktopSearchRef = useRef(null);

  // Fake suggestions
  const suggestions = [
    "Machine Learning",
    "Artificial Intelligence",
    "Deep Learning",
    "Data Mining",
    "Natural Language Processing",
    "Reinforcement Learning",
    "Basic Statistics",
  ];
  const filteredSuggestions = query
    ? suggestions.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // Handles click outside overlay (mobile)
  const handleOverlayClick = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setShowSearch(false);
    }
  };

  // Handles click outside (desktop)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(e.target)
      ) {
        // clear dropdown only
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Navbar */}
      <div className="w-full px-6 py-3 flex items-center justify-between bg-[#1a1a1a] border-b border-purple-500/40 text-white relative z-50">
        {/* Logo (left) */}
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-200 via-purple-500 to-purple-900 animate-gradient-wave bg-clip-text text-transparent">
          notesportal
        </div>

        {/* Desktop Search (center) */}
        <div className="hidden sm:flex flex-1 justify-center px-6">
          <div ref={desktopSearchRef} className="hidden relative w-full max-w-lg">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes, files, subjects..."
              className="w-full rounded-2xl bg-white/5 border border-purple-400/20 px-4 py-3 pl-11 text-sm text-purple-100 placeholder-purple-400/70 focus:outline-none focus:ring-2 focus:ring-purple-500/50  backdrop-blur-md transition-all duration-300"
            />
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />

            {/* Suggestions Dropdown */}
            {filteredSuggestions.length > 0 && (
              <ul className="absolute mt-3 w-[110%] -ml-[5%] rounded-2xl bg-transparent backdrop-blur-3xl border border-purple-400/30 text-purple-100 shadow-[0_8px_40px_rgba(0,0,0,0.35)] p-3">
                {suggestions.map((s, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 cursor-pointer transition-transform duration-300 ease-out hover:scale-[1.07] rounded-xl"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Mobile: Search Icon + Profile */}
        <div className="flex items-center gap-4 sm:hidden">
          <button
            onClick={() => setShowSearch(true)}
            className="hidden p-2 rounded-lg hover:bg-white/5 transition-all duration-300"
          >
            <FiSearch size={20} className="text-purple-400" />
          </button>
          <ProfileModal id={id} />
        </div>

        {/* Desktop Profile (right) */}
        <div className="hidden sm:flex">
          <ProfileModal id={id} />
        </div>
      </div>

      {/* Fullscreen Search Overlay (Mobile Only) */}
      {showSearch && (
        <div
          className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-lg flex flex-col items-center justify-start pt-24 px-6 animate-fadeIn"
          onClick={handleOverlayClick}
        >
          {/* Search Box */}
          <div ref={searchRef} className="relative w-full max-w-md">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              placeholder="Search..."
              className="w-full rounded-xl bg-white/10 border border-purple-400/20 px-4 py-3 pl-12 text-base text-purple-100 placeholder-purple-400/70 focus:outline-none focus:ring-2 focus:ring-purple-500/50  backdrop-blur-md transition-all duration-500"
            />
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400"
              size={18}
            />

            {/* Suggestions Dropdown (Mobile) */}
            {filteredSuggestions.length > 0 && (
              <ul className="absolute mt-2 w-full rounded-xl bg-[#1a1a1a]/95 border border-purple-500/20  backdrop-blur-xl overflow-hidden animate-slideDown z-50">
                {filteredSuggestions.map((item, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 text-sm text-purple-100 hover:bg-purple-500/20 hover:text-purple-200 cursor-pointer transition-colors duration-200"
                    onClick={() => {
                      setQuery(item);
                      setShowSearch(false);
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Fade + Slide Animations */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.35s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
