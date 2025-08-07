'use client'
import { useState } from "react";
import { createPortal } from "react-dom";
import { useEffect, useState as useClientState } from "react";
import toast from "react-hot-toast";

export default function FileViewModal({ data }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useClientState(false);
    function copyToClipboard(text) {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    console.log("Copied to clipboard:", text);
                    toast.success('link copied to clipboard')
                })
                .catch((err) => {
                    toast.error('failed to copy')
                });
        } else {
            console.error("Clipboard API not supported in this environment.");
        }
    }

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const modalContent = (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center">
            <div className="w-[90%] max-w-6xl h-[90%] rounded-xl p-4 shadow-lg flex flex-col md:flex-row gap-4 overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20">
                <div className="flex-1 h-full">
                    <embed src={data.filelink} type="application/pdf" className="w-full h-full rounded-lg" />
                </div>
                <div className="w-full md:w-[30%] h-full flex flex-col p-5 rounded-lg text-white">
                    <div className="flex justify-end mb-4">
                        <button onClick={() => setIsOpen(false)} className="text-white text-3xl">×</button>
                    </div>
                    <div className="space-y-4 text-[17px] flex-1">
                        <div>
                            <p className="text-purple-400 font-semibold">Filename:</p>
                            <p className="truncate">{data.filename}</p>
                        </div>
                        <div>
                            <p className="text-purple-400 font-semibold">Uploaded on:</p>
                            <p className="text-white/90">
                                {new Date(data.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                        </div>
                        <div>
                            <p className="text-purple-400 font-semibold">Description: </p>
                            <p>{data.description}</p>
                        </div>
                    </div>
                    <a href={data.filelink} download target="blank" className="mt-6 text-center text-base bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition-all">
                        open in new tab
                    </a>
                    <button onClick={() => copyToClipboard(`https://note.notesportal.live/${data.filename}`)} className="mt-3 text-center text-base bg-white/10 hover:bg-white/20 border border-purple-300 text-purple-200 py-2 px-4 rounded transition-all">
                        copy link
                    </button>

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
