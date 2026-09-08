import LoadingDots from "@/components/loadingDots";
import RecentFilesDisplay from "@/components/recent-files/recent-files-display";
import AddSubjectModal from "@/components/edit-subjects/add-sub";
import { getUserDataByUsername, getUserSubjectList } from "@/lib/data-fetch-functions";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/session";
import { SubjectViewModeProvider } from "@/components/subject-view/subject-view-mode-context";
import ViewToggle from "@/components/subject-view/view-toggle";
import SubjectView from "@/components/subject-view/subject-view";


export const metadata = {
  title: "notesportal",
};

const editButtonClass =
  "flex h-9 items-center justify-center gap-1.5 whitespace-nowrap px-4 rounded-full text-xs sm:text-sm font-medium bg-[rgb(var(--theme-glow-500))] text-white hover:brightness-110 transition-all duration-200";
const editIconClass = "text-xs sm:text-sm text-white leading-none";
const editLabelClass = "text-xs sm:text-sm font-medium text-white leading-none";

export default async function HomePage({ params }) {
  const userId = await getCurrentUser();
  const subjects = JSON.parse(await getUserSubjectList(userId));
  return (
    <>
      <SubjectViewModeProvider>
        <div className="px-6">
          <div className="flex items-center justify-between gap-2">
            <p className="font-bold text-lg">My Subjects</p>
            <div className="flex items-center gap-2">
              <ViewToggle />
              <AddSubjectModal
                id={userId}
                subjectList={subjects}
                buttonClass={editButtonClass}
                iconClass={editIconClass}
                labelClass={editLabelClass}
              />
            </div>
          </div>
          <SubjectView subjects={subjects} id={userId} />
        </div>
      </SubjectViewModeProvider>
      <div className="pt-6 md:pt-0">
        <p className="mt-2 md:mt-0 px-6">Recent Files</p>
        <Suspense fallback={<LoadingDots text="fetching recent files" />}>
          <RecentFilesDisplay id={userId} src={`/home`} />
        </Suspense>
      </div>
    </>
  );
}
