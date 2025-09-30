"use client";
import { useState } from "react";
import FileCardWrapper from "@/components/file-card";
import { FiGrid, FiList } from "react-icons/fi";
import { usePathname } from "next/navigation";

export default function SSFilesGrid({ files, id }) {
    const [viewMode, setViewMode] = useState("grid");
    const path = usePathname()
    return (
        <>
            <div className="w-full px-4 sm:px-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4 gap-3">
                    <p className="text-white/80 text-left">{files.length} files available</p>
                    <div className="flex space-x-2 sm:space-x-3">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`transition-transform duration-300 transform hover:scale-110 p-1.5 sm:p-2.5 rounded-lg ${viewMode === "grid"
                                    ? "bg-purple-700 text-white"
                                    : "bg-[#1a1a1a]/50 text-gray-400 hover:bg-purple-600/70"
                                }`}
                        >
                            <FiGrid className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`transition-transform duration-300 transform hover:scale-110 p-1.5 sm:p-2.5 rounded-lg ${viewMode === "list"
                                    ? "bg-purple-700 text-white"
                                    : "bg-[#1a1a1a]/50 text-gray-400 hover:bg-purple-600/70"
                                }`}
                        >
                            <FiList className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </div>

                {/* File cards container */}
                <div
                    className={`flex-1 overflow-auto scrollbar-hide transition-all duration-500 ease-in-out ${viewMode === "grid"
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-min"
                            : "flex flex-col gap-4"
                        }`}
                    style={{ maxHeight: "calc(100vh - 200px)" }}
                >
                    {files.map((file, index) => (
                        <div key={index} className="w-full">
                            <FileCardWrapper
                                file={file}
                                index={index}
                                userid={id}
                                src={path}
                                viewMode={viewMode}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
