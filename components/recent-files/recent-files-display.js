import { getNotesLatestWeeks } from "@/lib/data-fetch-functions";
import RecentFilesGrid from "./recent-files-grid";

export default async function RecentFilesDisplay(){
    const recentfiles = await getNotesLatestWeeks(3);
    return <RecentFilesGrid data={recentfiles} weeks={3}/>
}