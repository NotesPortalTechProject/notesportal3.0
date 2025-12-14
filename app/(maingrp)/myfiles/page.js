import LoadingDots from "@/components/loadingDots";
import MyFilesDisplay from "@/components/my-files/my-files-display";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/session";

export default async function MyfIlesPage({ params }) {
    const userId = await getCurrentUser();
    return (
        <>
            <div>
                <Suspense fallback={<LoadingDots text="fetching your files"/>}>
                    <MyFilesDisplay id={userId} src={`/home`} />
                </Suspense>
            </div>
        </>
    );
}