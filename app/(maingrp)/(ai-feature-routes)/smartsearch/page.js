import SmartSearch from "@/components/smartsearch/smartsearch";
import { getCurrentUser } from "@/lib/session";

export default async function Page({params}){
    const userId = await getCurrentUser();
    return <SmartSearch userid={userId}/>
}