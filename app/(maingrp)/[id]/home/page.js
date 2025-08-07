import RecentFilesDisplay from "@/components/recent-files/recent-files-display";
import SubjectCardsDisplay from "@/components/subject-cards/subject-card-display";
import { getUserDataByUsername } from "@/lib/data-fetch-functions";
import { Suspense } from "react";

export default async function HomePage({ params }) {
    const userId = await params.id
    return (
        <>
            <div >
                <p>My Subjects</p>
                <Suspense fallback={<p>Fetching Subjects....</p>}>
                    <SubjectCardsDisplay id={userId} />
                </Suspense>
            </div>
            <div>
                <p>Recent Files</p>
                <Suspense fallback={<p>fetching recent files....</p>}>
                  <RecentFilesDisplay id={userId} src={`/${userId}/home`}/>
                </Suspense>
            </div>
        </>
    );
}