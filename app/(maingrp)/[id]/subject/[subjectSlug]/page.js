import FilesDisplay from "@/components/subject-files/files-display";
import { Suspense } from "react";
import Link from "next/link";
import LoadingDots from "@/components/loadingDots";

export default async function IndividualSubjectPage({ params }) {
  let initialSubjectName = params.subjectSlug;
  let tempSubjectName = initialSubjectName;
  const id = params.id;
  let tempflag = false;
  if(initialSubjectName=="CTPS"){
    tempflag = true;
    tempSubjectName = "PPS"
  }
  if(initialSubjectName =="BIO"){
    tempflag = true;
    tempSubjectName = "EOB"
  }
  return (
    <>
      <p className="text-lg font-semibold ml-8 mb-4">
        <Link href={`/${id}/home`} className="text-purple-400 hover:underline">
          My Subjects
        </Link>{" "}
        <span className="text-white">&gt; {initialSubjectName}</span>
      </p>
      <p className="text-md font-regular ml-8 mb-4"></p>

      <Suspense fallback={<LoadingDots text="Fetching files" />}>
        <FilesDisplay
          subject={subjectname}
          id={id}
          src={`/${id}/subject/${subjectname}`}
        />
      </Suspense>
    </>
  );
}
