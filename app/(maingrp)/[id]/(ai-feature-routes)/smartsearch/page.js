import SmartSearch from "@/components/smartsearch/smartsearch";

export default async function Page({params}){
    const userid = params.id;
    return <SmartSearch userid={userid}/>
}