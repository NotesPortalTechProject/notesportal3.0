import FilesDisplay from "@/components/subject-files/files-display";
import { Suspense } from "react";
import Link from "next/link";
import LoadingDots from "@/components/loadingDots";
import toast from "react-hot-toast";
import ShareSubjectButton from "@/components/shareSubjectButton";
import { getCurrentUser } from "@/lib/session";

export default async function IndividualSubjectPage({ params }) {
  let initialSubjectName = params.subjectSlug;
  let tempSubjectName = initialSubjectName;
  const id = await getCurrentUser();
  let tempflag = false;
  if (initialSubjectName == "CTPS") {
    tempflag = true;
    tempSubjectName = "PPS"
  }
  if (initialSubjectName == "BIO") {
    tempflag = true;
    tempSubjectName = "EOB"
  }
  if (initialSubjectName == "PNS") {
    tempflag = true;
    tempSubjectName = "PES"
  }
   if (initialSubjectName == "POM") {
    tempflag = true;
    tempSubjectName = "PEM"
  }

  function copyToClipboard(text) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => toast.success("link copied to clipboard"))
        .catch(() => toast.error("failed to copy"));
    }
  }

  return (
    <>
      <div className="flex items-center">
        <div>
          <p className="text-lg font-semibold ml-6 mb-2">
            <Link href={`/home`} className="text-purple-400 hover:underline">
              My Subjects
            </Link>{" "}
            <span className="text-white">&gt; {initialSubjectName}</span>
          </p>
        </div>
        <div>
          <ShareSubjectButton subjectName={initialSubjectName} />
        </div>
      </div>

      {tempflag && (
        <p className="text-sm font-regular ml-6 mb-6">{initialSubjectName} is similar to {tempSubjectName}</p>
      )}

      {tempflag && (
        <Suspense fallback={<LoadingDots text="Fetching files" />}>
          <FilesDisplay
            subject={tempSubjectName}
            id={id}
            src={`/subject/${initialSubjectName}`}
          />
        </Suspense>
      )}

      {!tempflag && (
        <Suspense fallback={<LoadingDots text="Fetching files" />}>
          <FilesDisplay
            subject={initialSubjectName}
            id={id}
            src={`/subject/${initialSubjectName}`}
          />
        </Suspense>
      )}
    </>
  );
}
