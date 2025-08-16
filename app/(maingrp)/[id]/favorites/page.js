import FavFilesDisplay from "@/components/fav-files/fav-files-display";
import LoadingDots from "@/components/loadingDots";
import { Suspense } from "react";

export default async function FavouritesPage({params}){
    const userid = await params.id;
    return(
        <>
        <p className="px-6">Favorite Files</p>
        <Suspense fallback={<LoadingDots text="fetching favorite files"/>}>
            <FavFilesDisplay userid={userid} src={`/${userid}/favorites`}/>
        </Suspense>
        </>
    );
}