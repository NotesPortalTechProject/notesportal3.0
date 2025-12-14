import ChatWithPdf from "@/components/chatwithpdf/chatwithpdf";
import { getUserSubjectList } from "@/lib/data-fetch-functions";
import { getUserIdContext, useUser } from "../../context/userProvider";

export default async function Page({params}){
    const userid = getUserIdContext();
    const subjectList = await getUserSubjectList(userid)
    return <ChatWithPdf userId={userid} subjectList={JSON.parse(subjectList)}/>
}