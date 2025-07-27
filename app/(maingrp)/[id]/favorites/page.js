import FavFilesDisplay from "@/components/fav-files/fav-files-display";
import { Suspense } from "react";

export default async function FavouritesPage({params}){
    const userid = await params.id;
    return(
        <>
        <p>Favorite Files</p>
        <Suspense>
            <FavFilesDisplay userid={userid} src={`/${userid}/favorites`}/>
        </Suspense>
        </>
    );
}