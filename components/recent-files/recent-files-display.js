import { getNotesLatestWeeks } from "@/lib/data-fetch-functions";
import RecentFilesGrid from "./recent-files-grid";

export default async function RecentFilesDisplay({id, src}){
    const recentfiles = await getNotesLatestWeeks(3);
    return <RecentFilesGrid data={recentfiles} weeks={3} userid={id} src={src}/>
}