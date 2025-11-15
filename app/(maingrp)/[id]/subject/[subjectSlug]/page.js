import FilesDisplay from "@/components/subject-files/files-display";
import { Suspense } from "react";
import Link from "next/link";
import LoadingDots from "@/components/loadingDots";

export default async function IndividualSubjectPage({ params }) {
  let initialSubjectName = params.subjectSlug;
  let tempSubjectName = initialSubjectName;
  const id = params.id;
  let tempflag = false;
  if (initialSubjectName == "CTPS") {
    tempflag = true;
    tempSubjectName = "PPS"
  }
  if (initialSubjectName == "BIO") {
    tempflag = true;
    tempSubjectName = "EOB"
  }
  if(initialSubjectName == "PNS"){
    tempflag = true;
    tempSubjectName = "PES"
  }
  return (
    <>
      <p className="text-lg font-semibold ml-6 mb-2">
        <Link href={`/${id}/home`} className="text-purple-400 hover:underline">
          My Subjects
        </Link>{" "}
        <span className="text-white">&gt; {initialSubjectName}</span>
      </p>
      {tempflag && (
        <p className="text-sm font-regular ml-6 mb-6">{initialSubjectName} is similar to {tempSubjectName}</p>
      )}

      {tempflag && (
        <Suspense fallback={<LoadingDots text="Fetching files" />}>
          <FilesDisplay
            subject={tempSubjectName}
            id={id}
            src={`/${id}/subject/${initialSubjectName}`}
          />
        </Suspense>
      )}

      {!tempflag && (
        <Suspense fallback={<LoadingDots text="Fetching files" />}>
          <FilesDisplay
            subject={initialSubjectName}
            id={id}
            src={`/${id}/subject/${initialSubjectName}`}
          />
        </Suspense>
      )}
    </>
  );
}
