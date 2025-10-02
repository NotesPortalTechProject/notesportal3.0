"use client";
import { useState, useEffect, useRef } from "react";
import { logout } from "@/actions/auth-actions";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiUpload,
  FiUser,
  FiStar,
  FiFile,
  FiLogOut,
  FiSearch,
  FiCpu,
  FiMessageSquare,
  FiCommand,
} from "react-icons/fi";
import UploadFileModal from "../upload-file-modal";

export default function VerticalSidebar({ id, subjectlist }) {
  const pathname = usePathname();
  const [aiOpen, setAiOpen] = useState(false);
  const aiRef = useRef(null);

  const handleLogout = () => {
    logout();
  };

  // Close popup if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (aiRef.current && !aiRef.current.contains(event.target)) {
        setAiOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-max-sc w-64 bg-[#1a1a1a] border-r border-purple-500/40 backdrop-blur-md text-white p-4 flex-col">
        {/* Nav links scroll if too long */}
        <nav className="flex flex-col gap-3 mt-6 overflow-y-auto flex-1">
          <NavItem icon={<FiHome />} label="Home" id={id} endpoint="home" pathname={pathname} />
          <NavItem icon={<FiStar />} label="Favorites" id={id} endpoint="favorites" pathname={pathname} />

          <UploadFileModal id={id} subjectlist={subjectlist}>
            <div className="group relative flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 border-l-2 hover:bg-white/5 text-white/80 hover:text-white border-transparent">
              <div className="text-lg text-purple-400">
                <FiUpload />
              </div>
              <span className="font-medium tracking-wide">Upload</span>
            </div>
          </UploadFileModal>

          <NavItem icon={<FiFile />} label="My Files" id={id} endpoint="myfiles" pathname={pathname} />
          <NavItem icon={<FiUser />} label="Profile" id={id} endpoint="profile" pathname={pathname} />
          <NavItem icon={<FiMessageSquare />} label="Chat with Pdf" id={id} endpoint={"chatwithpdf"} pathname={pathname} />
          <NavItem icon={<FiSearch />} label="Smart Search" id={id} endpoint={"smartsearch"} pathname={pathname} />
          <NavItem icon={<FiCpu />} label="Qna Engine" id={id} endpoint={"qna"} pathname={pathname} />
        </nav>

        {/* Logout at bottom */}
        <button
          onClick={handleLogout}
          className="mb-0 group relative flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 border-l-2 hover:bg-white/5 text-white/80 hover:text-white border-transparent"
        >
          <div className="text-lg text-purple-400 group-hover:text-purple-300">
            <FiLogOut />
          </div>
          <span className="font-medium tracking-wide">Logout</span>
        </button>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-between items-center bg-black/40 backdrop-blur-md border-t border-purple-500/20 text-white px-4 py-2 shadow-[0_0_10px_rgba(168,85,247,0.1)] lg:hidden">
        <BottomNavItem icon={<FiHome />} label="Home" id={id} endpoint="home" pathname={pathname} />
        <BottomNavItem icon={<FiStar />} label="Favorites" id={id} endpoint="favorites" pathname={pathname} />
        <UploadFileModal id={id} subjectlist={subjectlist}>
          <div className="relative flex flex-col items-center justify-center p-3 rounded-full -mt-8 z-10 bg-purple-500 text-white">
            <div className="text-xl sm:text-2xl text-white">
              <FiUpload />
            </div>
            <span className="hidden sm:block text-xs mt-1">Upload</span>
          </div>
        </UploadFileModal>
        <BottomNavItem icon={<FiFile />} label="Files" id={id} endpoint="myfiles" pathname={pathname} />

        {/* AI Popup Trigger */}
        <div className="relative" ref={aiRef}>
          <div
            onClick={() => setAiOpen((prev) => !prev)}
            className="relative flex flex-col items-center justify-center transition-all duration-150 px-2 py-1 text-white/70 hover:text-white cursor-pointer"
          >
            <div className="text-xl sm:text-2xl text-purple-400">
              <FiCommand />
            </div>
            <span className="hidden sm:block text-xs mt-1">AI</span>
          </div>

          {/* AI Popup CHALU*/}
          {aiOpen && (
            <div className="absolute bottom-14 right-0 bg-[#1a1a1a] border border-purple-500/30 rounded-xl shadow-lg p-3 w-44 z-50">
              <Link
                href={`/${id}/chatwithpdf`}
                onClick={() => setAiOpen(false)}
                className="block px-3 py-2 rounded-md hover:bg-white/10 text-white/80 hover:text-white transition"
              >
                Chat with PDF
              </Link>
              <Link
                href={`/${id}/smartsearch`}
                onClick={() => setAiOpen(false)}
                className="block px-3 py-2 rounded-md hover:bg-white/10 text-white/80 hover:text-white transition"
              >
                Smart Search
              </Link>
              <Link
                href={`/${id}/qna`}
                onClick={() => setAiOpen(false)}
                className="block px-3 py-2 rounded-md hover:bg-white/10 text-white/80 hover:text-white transition"
              >
                Qna Engine
              </Link>
            </div>
          )}

          {/* AI POP UP ENDS */}
        </div>
      </div>
    </>
  );
}

// ========== Desktop NavItem ==========
function NavItem({ icon, label, id, endpoint, pathname }) {
  const active = pathname.includes(`/${id}/${endpoint}`);
  return (
    <Link href={`/${id}/${endpoint}`}>
      <div
        className={`group relative flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 border-l-2
          ${active
            ? "bg-white/5 text-purple-300 border-purple-500"
            : "hover:bg-white/5 text-white/80 hover:text-white border-transparent"
          }
        `}
      >
        <div className={`text-lg ${active ? "text-purple-300" : "text-purple-400"}`}>
          {icon}
        </div>
        <span className="font-medium tracking-wide">{label}</span>
      </div>
    </Link>
  );
}

// ========== Mobile Bottom NavItem ==========
function BottomNavItem({ icon, label, id, endpoint, pathname, onClick }) {
  const active = pathname.includes(`/${id}/${endpoint}`);
  return onClick ? (
    <div
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center transition-all duration-150 px-2 py-1 border-t-2 ${active
        ? "text-purple-300 font-semibold border-purple-500"
        : "text-white/70 hover:text-white border-transparent"
        } cursor-pointer`}
    >
      <div className={`text-xl sm:text-2xl ${active ? "text-purple-300" : "text-purple-400"}`}>
        {icon}
      </div>
      <span className="hidden sm:block text-xs mt-1">{label}</span>
    </div>
  ) : (
    <Link href={`/${id}/${endpoint}`}>
      <div
        className={`relative flex flex-col items-center justify-center transition-all duration-150 px-2 py-1 border-t-2 ${active
          ? "text-purple-300 font-semibold border-purple-500"
          : "text-white/70 hover:text-white border-transparent"
          }`}
      >
        <div className={`text-xl sm:text-2xl ${active ? "text-purple-300" : "text-purple-400"}`}>
          {icon}
        </div>
        <span className="hidden sm:block text-xs mt-1">{label}</span>
      </div>
    </Link>
  );
}
