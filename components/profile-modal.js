'use client';
import { FiUser, FiLogOut } from "react-icons/fi";
import { useState, useRef, useEffect } from 'react';
import Link from "next/link";
import LoadingDots from "./loadingDots";
import { logout } from "@/actions/auth-actions";
import UploadBadges from "./badges/upload-badges";
import Image from "next/image";

export default function ProfileDropdown({ id, userinfo, noOfUploads }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  const calculatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const modalWidth = 320;
    const padding = 16;
    const viewportWidth = window.innerWidth;

    let left = rect.left;
    if (left + modalWidth > viewportWidth - padding) {
      left = viewportWidth - modalWidth - padding;
    } else if (left < padding) {
      left = padding;
    }

    const top = rect.bottom + 12;
    setPosition({ top, left });
  };

  useEffect(() => {
    if (isOpen) {
      calculatePosition()
      window.addEventListener('resize', calculatePosition);
      return () => window.removeEventListener('resize', calculatePosition);
    }
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="
    relative
    w-10 h-10 sm:w-11 sm:h-11
    rounded-full
    overflow-hidden
    border border-purple-500/30
    hover:border-purple-400
    shadow-md
    transition-all duration-200
    hover:scale-105
    active:scale-95
    bg-[#1a0a2d]/70
    backdrop-blur-md
    flex items-center justify-center
  "
      >
        <Image
          src={`/profileicons/${userinfo.profile_icon}.jpg`}
          alt="Profile Icon"
          fill
          sizes="44px"
          className="object-cover"
          priority
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div
            className="absolute z-50 w-[90vw] max-w-[320px] p-5 rounded-2xl
              backdrop-blur-xl bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a1a3d]/60
              border border-white/5 shadow-[0_0_30px_rgba(168,85,247,0.08)] text-white
              overflow-y-auto max-h-[80vh] flex flex-col"
            style={{ top: position.top, left: position.left }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-purple-300">Profile</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs font-medium bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg transition"
              >
                Close
              </button>
            </div>

            {userinfo ? (
              <div className="flex flex-col gap-4 flex-1">
                <div className="text-sm bg-white/5 border border-purple-500/10 p-3 rounded-xl shadow-sm">
                  <p className="text-purple-300 mb-1">Hello, {userinfo.username}</p>
                  <p>{userinfo.firstname} {userinfo.lastname}</p>
                  <p className="text-white/70 text-sm">{userinfo.email}</p>
                </div>

                <div className="flex items-center justify-between gap-2 text-sm">
                  <div className="flex-1 p-3 rounded-xl bg-white/5 border border-purple-500/10 text-center">
                    <p className="text-purple-300 text-sm">Subjects</p>
                    <p className="text-4xl font-semibold text-white">
                      {JSON.parse(userinfo.subjects).length}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 text-sm">
                  <div className="flex-1 p-3 rounded-xl bg-white/5 border border-purple-500/10">
                    <p className="text-purple-300 text-sm mb-3">Badges</p>
                    <UploadBadges noofuploads={noOfUploads} />
                  </div>
                </div>

                <Link
                  href={`/profile`}
                  onClick={() => setIsOpen(false)}
                  className="mt-2 w-full text-center text-sm text-purple-300 hover:text-white hover:underline transition-all"
                >
                  Visit Profile Page →
                </Link>

                {/* Logout button at the bottom */}
                <button
                  onClick={handleLogout}
                  className="lg:hidden m-auto group relative flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 border-l-2 hover:bg-white/5 text-white/80 hover:text-white border-transparent"
                >
                  <div className="text-lg text-purple-400 group-hover:text-purple-300">
                    <FiLogOut />
                  </div>
                  <span className="font-medium tracking-wide">Logout</span>
                </button>
              </div>
            ) : (
              <LoadingDots text="fetching information" />
            )}
          </div>
        </>
      )}
    </>
  );
}