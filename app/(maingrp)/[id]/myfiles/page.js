import LoadingDots from "@/components/loadingDots";
import MyFilesDisplay from "@/components/my-files/my-files-display";
import { Suspense } from "react";
export default async function MyfIlesPage({ params }) {
    const userid = await params.id;
    return (
        <>
            <div>
                <p className="px-6">My files</p>
                <Suspense fallback={<LoadingDots text="fetching your files"/>}>
                    <MyFilesDisplay id={userid} src={`/${userid}/home`} />
                </Suspense>
            </div>
        </>
    );
}