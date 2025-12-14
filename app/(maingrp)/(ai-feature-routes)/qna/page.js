import QnaEngine from "@/components/qna-engine/qna-engine";
import { getUserSubjectList } from "@/lib/data-fetch-functions";

export default async function Page({params}){
    const userId = await getCurrentUser();
    const subjectList = await getUserSubjectList(userId)
    return <QnaEngine userId={userId} subjectList={JSON.parse(subjectList)}/>
}