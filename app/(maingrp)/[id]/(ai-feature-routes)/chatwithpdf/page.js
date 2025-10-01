import ChatWithPdf from "@/components/chatwithpdf/chatwithpdf";
import { getUserSubjectList } from "@/lib/data-fetch-functions";

export default async function Page({params}){
    const userid = params.id;
    const subjectList = await getUserSubjectList(userid)
    return <ChatWithPdf userId={userid} subjectList={JSON.parse(subjectList)}/>
}