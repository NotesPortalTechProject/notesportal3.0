'use client';

import { uploadFile } from '@/actions/other-actions';
import { useState, useEffect, useActionState } from 'react';
import { createPortal } from 'react-dom';

export default function UploadFileModal({ children, id }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [formState, formAction] = useActionState(uploadFile, {});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const modalContent = (
    <>
      <div className="fixed inset-0 z-40 backdrop-blur-sm bg-black/50" onClick={() => setIsOpen(false)} />
      <div className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-[320px] p-5 rounded-2xl -translate-x-1/2 -translate-y-1/2 backdrop-blur-xl bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a1a3d]/60 border border-white/5 shadow-[0_0_30px_rgba(168,85,247,0.08)] text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-purple-300">Upload File</h2>
          <button onClick={() => setIsOpen(false)} className="text-xs font-medium bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg transition">Close</button>
        </div>
        <div className="text-sm text-white/80">
          <form action={formAction} className="flex flex-col gap-3">
            <input type="text" name="id" value={id} readOnly hidden />
            <input type="text" name="subjectcode" placeholder="enter subject code" required className="bg-[#121212] border border-purple-700 rounded-md px-3 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <input type="file" name="file" required className="text-white" accept="application/pdf"/>
            <input type="text" name="filename" placeholder="enter a suitable filename" required className="bg-[#121212] border border-purple-700 rounded-md px-3 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <input type="text" name="description" placeholder="enter a suitable description" required className="bg-[#121212] border border-purple-700 rounded-md px-3 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-semibold transition">Submit</button>
            {formState?.errors?.length > 0 && (
              <ul className="text-sm text-red-400 mt-2 space-y-1">
                {formState.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
          </form>
        </div>
      </div>
    </>
  );

  return (
    <>
      <button onClick={() => setIsOpen(true)} type="button" className="contents">
        {children}
      </button>
      {isMounted && isOpen && createPortal(modalContent, document.body)}
    </>
  );
}
