import SmartSearch from "@/components/smartsearch/smartsearch";
import { getUserIdContext } from "../../context/userProvider";

export default async function Page({params}){
    const userid = getUserIdContext()
    return <SmartSearch userid={userid}/>
}