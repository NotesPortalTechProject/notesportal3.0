import LoadingDots from "@/components/loadingDots";
import MyFilesDisplay from "@/components/my-files/my-files-display";
import { Suspense } from "react";
import { getUserIdContext } from "../context/userProvider";
export default async function MyfIlesPage({ params }) {
    const userid = getUserIdContext()
    return (
        <>
            <div>
                <Suspense fallback={<LoadingDots text="fetching your files"/>}>
                    <MyFilesDisplay id={userid} src={`/home`} />
                </Suspense>
            </div>
        </>
    );
}