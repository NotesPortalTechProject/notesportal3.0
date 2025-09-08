import FilesDisplay from "@/components/subject-files/files-display";
import { Suspense } from "react";
import Link from "next/link";
import LoadingDots from "@/components/loadingDots";

export default async function IndividualSubjectPage({ params }) {
  const subjectname = params.subjectSlug;
  const filetype = params.filetype;
  const id = params.id;
  const filetypesList = ["all", "pdf", "doc", "docx", "ppt", "pptx"];

  return (
    <>
      <p className="text-lg font-semibold ml-8 mb-4">
        <Link href={`/${id}/home`} className="text-purple-400 hover:underline">
          My Subjects
        </Link>{" "}
        <span className="text-white">&gt; {subjectname}</span>
      </p>

      {/* Filetype buttons container aligned with file card width */}
      <div className="max-w-[90%] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[900px] mx-auto flex items-center gap-3 mt-2 mb-2 px-2 overflow-x-auto scrollbar-hide">
        {filetypesList.map((ft, idx) => (
          <Link
            key={idx}
            href={`/${id}/subject/${subjectname}/${ft}`}
            className="flex-shrink-0"
          >
            <div
              className={`relative overflow-hidden rounded-xl px-4 py-2 text-sm md:text-base font-medium transition-all
                backdrop-blur-md
                ${
                  filetype === ft
                    ? "bg-gradient-to-r from-[#2a0a3d]/70 via-[#4b0e63]/60 to-[#2a0a3d]/70 text-white border border-purple-400/30 shadow-[0_0_6px_rgba(168,85,247,0.25)]"
                    : "bg-gradient-to-r from-[#1a1a1a]/50 via-[#2a1a3d]/30 to-[#3d1f5e]/30 text-purple-200 border border-purple-500/10 hover:border-purple-400/20 hover:text-white hover:shadow-[0_0_4px_rgba(168,85,247,0.15)]"
                }`}
            >
              <p className="truncate relative z-10">{ft.toUpperCase()}</p>

              {/* diagonal glass reflection effect (very subtle) */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-30 -translate-x-full hover:translate-x-0 transition-transform duration-500"></div>
            </div>
          </Link>
        ))}
      </div>

      <Suspense fallback={<LoadingDots text="Fetching files" />}>
        <FilesDisplay
          subject={subjectname}
          filetype={filetype}
          id={id}
          src={`/${id}/subject/${subjectname}/${filetype}`}
        />
      </Suspense>
    </>
  );
}
