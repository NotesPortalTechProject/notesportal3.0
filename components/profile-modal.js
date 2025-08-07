'use client';
import { FiUser } from "react-icons/fi";
import { useState, useRef, useEffect } from 'react';
import Link from "next/link";

export default function ProfileDropdown({ id }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [userdata, setUserdata] = useState(null);
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
      calculatePosition();

      fetch('/api/getuserdata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userid: id })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) setUserdata(data.userdata);
          else console.error('Failed to fetch user data');
        })
        .catch(err => console.error('Fetch error:', err));

      window.addEventListener('resize', calculatePosition);
      return () => window.removeEventListener('resize', calculatePosition);
    }
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 bg-[#1a0a2d]/70 text-purple-300 border border-purple-500/20 hover:border-purple-500 rounded-full shadow-sm backdrop-blur-md transition"
        type="button"
      >
        <FiUser className="text-xl" />
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
              overflow-y-auto max-h-[80vh]"
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

            {userdata ? (
              <div className="flex flex-col gap-4">
                <div className="text-sm bg-white/5 border border-purple-500/10 p-3 rounded-xl shadow-sm">
                  <p className="text-purple-300 mb-1">Hello, @{userdata.username}</p>
                  <p>{userdata.firstname} {userdata.lastname}</p>
                  <p className="text-white/70 text-sm">{userdata.email}</p>
                </div>

                <div className="flex items-center justify-between gap-2 text-sm">
                  <div className="flex-1 p-3 rounded-xl bg-white/5 border border-purple-500/10 text-center">
                    <p className="text-purple-300 text-sm">Subjects</p>
                    <p className="text-lg font-semibold text-white">
                      {JSON.parse(userdata.subjects).length}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/${id}/profile`}
                  onClick={() => setIsOpen(false)}
                  className="mt-2 w-full text-center text-sm text-purple-300 hover:text-white hover:underline transition-all"
                >
                  Visit Profile Page →
                </Link>
              </div>
            ) : (
              <p className="text-white/70 text-sm">Loading...</p>
            )}
          </div>
        </>
      )}
    </>
  );
}
