import SmartSearch from "@/components/smartsearch/smartsearch";
import { getUserIdContext, useUserId } from "../../context/userProvider";

export default async function Page({params}){
    const userid = useUserId();
    return <SmartSearch userid={userid}/>
}