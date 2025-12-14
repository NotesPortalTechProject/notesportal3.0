import ChatWithPdf from "@/components/chatwithpdf/chatwithpdf";
import { getUserSubjectList } from "@/lib/data-fetch-functions";
import { useUserId } from "../../context/userProvider";

export default async function Page({params}){
    const userid = useUserId();
    const subjectList = await getUserSubjectList(userid)
    return <ChatWithPdf userId={userid} subjectList={JSON.parse(subjectList)}/>
}