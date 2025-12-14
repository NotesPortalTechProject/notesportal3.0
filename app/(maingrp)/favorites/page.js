import FavFilesDisplay from "@/components/fav-files/fav-files-display";
import LoadingDots from "@/components/loadingDots";
import { Suspense } from "react";
import { getUserIdContext } from "../context/userProvider";

export default async function FavouritesPage({params}){
    const userid = getUserIdContext();
    return(
        <>
        <p className="px-6">Favorite Files</p>
        <Suspense fallback={<LoadingDots text="fetching favorite files"/>}>
            <FavFilesDisplay userid={userid} src={`/favorites`}/>
        </Suspense>
        </>
    );
}