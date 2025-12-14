import FavFilesDisplay from "@/components/fav-files/fav-files-display";
import LoadingDots from "@/components/loadingDots";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/session";

export default async function FavouritesPage({params}){
    const userId = await getCurrentUser();
    return(
        <>
        <p className="px-6">Favorite Files</p>
        <Suspense fallback={<LoadingDots text="fetching favorite files"/>}>
            <FavFilesDisplay userid={userId} src={`/favorites`}/>
        </Suspense>
        </>
    );
}