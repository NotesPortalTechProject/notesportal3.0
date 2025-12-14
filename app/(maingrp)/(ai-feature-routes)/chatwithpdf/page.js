import ChatWithPdf from "@/components/chatwithpdf/chatwithpdf";
import { getUserSubjectList } from "@/lib/data-fetch-functions";
import { getCurrentUser } from "@/lib/session";

export default async function Page({params}){
    const userId = await getCurrentUser();
    const subjectList = await getUserSubjectList(userId)
    return <ChatWithPdf userId={userId} subjectList={JSON.parse(subjectList)}/>
}