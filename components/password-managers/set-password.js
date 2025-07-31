'use client';
import { FiLock } from "react-icons/fi";
import { useState } from 'react';

export default function SetPasswordModal({id}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 bg-[#170b22] border border-purple-500/40 hover:border-purple-400 text-white px-4 py-2 rounded-lg transition" type="button"><FiLock className="text-lg"/> Set Password</button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 backdrop-blur-sm" />
          <div className="relative z-10 bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-2">Set Password</h2>
            <p className="mb-4">This is the modal content.</p>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
