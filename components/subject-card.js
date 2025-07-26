'use client'
import { FileText } from "lucide-react"
export default function SubjectCard({ subject }) {
    return (
        <>
            <div
                className="w-40 h-40 flex items-center justify-center text-center text-white font-medium text-lg
    relative rounded-2xl overflow-hidden 
    bg-[url('/back1.jpg')] bg-cover bg-center
    bg-blend-overlay bg-gradient-to-b from-[#1a122d]/60 to-[#1a0a2d]/80 
    backdrop-blur-lg border border-purple-500/10 
    shadow-[0_0_10px_#a855f722] hover:shadow-[0_0_15px_#c084fcaa] 
    transition-all duration-300 ease-in-out hover:scale-[1.015]"
            >
                <p>{subject}</p>
            </div>

        </>
    );
}