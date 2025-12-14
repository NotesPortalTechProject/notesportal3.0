import SmartSearch from "@/components/smartsearch/smartsearch";

export default async function Page({params}){
    const userId = await getCurrentUser();
    return <SmartSearch userid={userId}/>
}