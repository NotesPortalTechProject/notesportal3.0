'use client'

import Link from "next/link"
import { FileText } from "lucide-react"

export default function SubjectCards({ subjects, id }) {
    return (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 sm:p-6">
            {subjects.map((subject, index) => (
                <Link href={`/${id}/subject/${subject}`} key={index}>
                    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#1a122d]/60 to-[#1a0a2d]/80 backdrop-blur-lg border border-purple-500/10 shadow-[0_0_10px_#a855f722] hover:shadow-[0_0_15px_#c084fcaa] transition-all duration-300 ease-in-out hover:scale-[1.015]">
                        
                        {/* Notes Count Badge */}
                        <div className="absolute top-4 right-4 px-3 py-1 text-xs font-medium bg-white/5 text-purple-200 backdrop-blur-md border border-purple-400/10 rounded-full z-10">
                            {subject.notesCount || 0} Notes
                        </div>

                        {/* Card Content */}
                        <div className="p-4">
                            <img
                                src="/sample-thumbnail.png"
                                className="w-full h-36 sm:h-40 object-cover rounded-xl mb-4 border border-purple-400/20"
                            />

                            <h2 className="text-base sm:text-lg font-bold text-purple-200 mb-1 tracking-wide">
                                {subject.title || subject}
                            </h2>

                            <p className="text-sm text-purple-100/60 mb-3">
                                An overview of notes in this subject
                            </p>

                            <hr className="border-purple-500/10 mb-3" />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-purple-400/40 rounded-full border border-purple-400/20" />
                                    <span className="text-sm text-white/80">
                                        {subject.instructor || "Instructor"}
                                    </span>
                                </div>
                                <FileText className="text-purple-300" size={20} />
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}
