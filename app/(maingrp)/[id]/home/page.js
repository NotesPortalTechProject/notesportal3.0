import RecentFilesDisplay from "@/components/recent-files/recent-files-display";
import SubjectCardsDisplay from "@/components/subject-cards/subject-card-display";
import { Suspense } from "react";

export default async function HomePage({ params }) {
    const userId = await params.id
    return (
        <>
            <p>Home Page</p>
            <div>
                <Suspense fallback={<p>Fetching Subjects....</p>}>
                    <SubjectCardsDisplay id={userId} />
                </Suspense>
            </div>
            <div>
                <p>Recent Files</p>
                <Suspense fallback={<p>fetching recent files....</p>}>
                  <RecentFilesDisplay/>
                </Suspense>
            </div>
        </>
    );
}