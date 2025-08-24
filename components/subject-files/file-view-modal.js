'use client'
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

export default function FileViewModal({ data }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    function copyToClipboard(text) {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => { toast.success('link copied to clipboard'); }).catch(() => { toast.error('failed to copy'); });
        }
    }

    function downloadFile(filename) {
        const url = `/api/download?url=${encodeURIComponent(data.filelink)}&name=${encodeURIComponent(filename)}`;
        const link = document.createElement('a');
        link.href = url;
        link.click();
    }

    useEffect(() => { setIsMounted(true); }, []);

    const modalContent = (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-6xl h-[90%] rounded-xl shadow-lg flex flex-col md:flex-row gap-4 overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20">
                <div className="flex-1 h-full">
                    <div className="md:hidden h-full flex items-center justify-center p-6">
                        <div className="w-full h-full rounded-xl border border-white/15 bg-white/[0.06] flex flex-col items-center justify-center text-center px-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 opacity-80" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8zm0 2.8L18.2 9H14zM8 13h8v2H8zm0 4h8v2H8zM8 9h4v2H8z"/></svg>
                            <p className="text-white/80 font-medium">open in new tab to check exact details</p>
                        </div>
                    </div>
                    <div className="hidden md:block w-full h-full">
                        <embed src={data.filelink} type="application/pdf" className="w-full h-full rounded-lg" />
                    </div>
                </div>

                <div className="w-full md:w-[30%] h-full flex flex-col p-5 rounded-lg text-white">
                    <div className="flex justify-end mb-4">
                        <button onClick={() => setIsOpen(false)} className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-3 py-1 rounded-md transition-all">Close</button>
                    </div>

                    <div className="space-y-4 text-[17px] flex-1 overflow-y-auto">
                        <div><p className="text-purple-400 font-semibold">Filename</p><p className="truncate">{data.filename}</p></div>
                        <div><p className="text-purple-400 font-semibold">Uploaded on</p><p className="text-white/90">{new Date(data.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p></div>
                        <div><p className="text-purple-400 font-semibold">Description</p><p>{data.description}</p></div>
                    </div>

                    <a href={data.filelink} target="_blank" rel="noopener noreferrer" className="mt-4 w-full text-center text-base bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition-all">open in new tab</a>
                    <button onClick={() => copyToClipboard(`https://note.notesportal.live/${data.filename}`)} className="mt-3 w-full text-center text-base bg-white/10 hover:bg-white/20 border border-purple-300 text-purple-200 py-2 px-4 rounded transition-all">copy link</button>
                    <p className="mt-3 text-sm text-white/70">Download may take a few seconds</p>
                    <button onClick={() => downloadFile(data.filename)} className="mt-1 w-full text-center text-base bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-all">download</button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <button onClick={() => setIsOpen(true)} className="text-purple-300 text-sm font-medium px-2 py-1 bg-white/5 rounded-md border border-purple-500/20">Open</button>
            {isMounted && isOpen && createPortal(modalContent, document.body)}
        </>
    );
}
