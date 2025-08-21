'use client';

import { uploadFile } from '@/actions/other-actions';
import { useState, useEffect, useActionState } from 'react';
import { createPortal } from 'react-dom';

export default function UploadFileModal({ children, id }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [formState, formAction] = useActionState(uploadFile, {});

  // Local state to persist input values
  const [subjectcode, setSubjectcode] = useState('');
  const [filename, setFilename] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const modalContent = (
    <>
      <div
        className="fixed inset-0 z-40 backdrop-blur-sm bg-black/50"
        onClick={() => setIsOpen(false)}
      />
      <div
        className="fixed top-1/2 left-1/2 z-50 w-[92vw] sm:w-[500px] max-w-[95vw] p-8 rounded-3xl
        backdrop-blur-xl bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a1a3d]/60
        border border-white/5 shadow-[0_0_40px_rgba(168,85,247,0.1)] text-white
        -translate-x-1/2 -translate-y-1/2"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-purple-300">Upload File</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-sm sm:text-base font-medium bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg transition"
            disabled={true}
          >
            Close
          </button>
        </div>

        <form action={formAction} className="flex flex-col gap-5">
          <input type="text" name="id" value={id} readOnly hidden />

          <input
            type="text"
            name="subjectcode"
            value={subjectcode}
            onChange={(e) => setSubjectcode(e.target.value)}
            placeholder="Enter subject code"
            required
            className="bg-white/5 border border-purple-500/20 rounded-lg px-4 py-3 text-base sm:text-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="file"
            name="file"
            required
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-white text-base sm:text-lg file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
          />

          <input
            type="text"
            name="filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="Enter a suitable filename"
            required
            className="bg-white/5 border border-purple-500/20 rounded-lg px-4 py-3 text-base sm:text-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="text"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a suitable description"
            required
            className="bg-white/5 border border-purple-500/20 rounded-lg px-4 py-3 text-base sm:text-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold text-base sm:text-lg transition"
          >
            Submit
          </button>

          {formState?.errors?.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mt-3">
              <ul className="text-sm sm:text-base text-red-400 space-y-1">
                {formState.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </form>
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
