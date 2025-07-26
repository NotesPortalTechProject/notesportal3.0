import { getFavFiles } from "@/lib/data-fetch-functions";

export default async function FavouritesPage({params}){
    const userid = await params.id;
    const userfavs = await getFavFiles(userid)
    console.log(typeof(userfavs))
    return(
        <>
        <p>Fav Files</p>
        {userfavs}
        </>
    );
}