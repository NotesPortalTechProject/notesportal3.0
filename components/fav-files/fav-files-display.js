import { getFavFiles } from "@/lib/data-fetch-functions";
import FavFilesGrid from "./fav-files-grid";

export default async function FavFilesDisplay({ userid, src }) {
  const favFiles = await getFavFiles(userid);
  return (
    <>
    <FavFilesGrid data={favFiles} userid={userid} src={src}/>
    </>
  );
}
