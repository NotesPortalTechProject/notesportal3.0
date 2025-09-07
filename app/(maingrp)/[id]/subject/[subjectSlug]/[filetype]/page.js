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

      <div className="w-full md:w-1/2 flex items-center gap-3 mt-2 mb-2 px-4 overflow-x-auto scrollbar-hide">
        {filetypesList.map((ft, idx) => (
          <Link
            key={idx}
            href={`/${id}/subject/${subjectname}/${ft}`}
            className="flex-shrink-0"
          >
            <div
              className={`rounded-xl px-4 py-2 text-sm md:text-base transition-all
                backdrop-blur-lg
                shadow-[0_0_12px_rgba(0,0,0,0.25),0_0_6px_rgba(168,85,247,0.25)]
                hover:shadow-[0_0_18px_rgba(0,0,0,0.35),0_0_10px_rgba(168,85,247,0.35)]
                ${
                  filetype === ft
                    ? "bg-gradient-to-r from-purple-300/40 to-purple-500/40 text-white border-2 border-purple-300/50"
                    : "bg-gradient-to-r from-purple-200/20 via-purple-400/20 to-purple-600/20 text-purple-100 border border-white/10 hover:border-purple-300/40 hover:text-white"
                }`}
            >
              <p className="truncate">{ft}</p>
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
