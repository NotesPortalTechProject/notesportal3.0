import QnaEngine from "@/components/qna-engine/qna-engine";
import { getUserSubjectList } from "@/lib/data-fetch-functions";

export default async function Page({params}){
    const userid = params.id;
    const subjectList = await getUserSubjectList(userid)
    return <QnaEngine userId={userid} subjectList={JSON.parse(subjectList)}/>
}