import QnaEngine from "@/components/qna-engine/qna-engine";
import { getUserSubjectList } from "@/lib/data-fetch-functions";
import { getUserIdContext } from "../../context/userProvider";

export default async function Page({params}){
    const userid = getUserIdContext();
    const subjectList = await getUserSubjectList(userid)
    return <QnaEngine userId={userid} subjectList={JSON.parse(subjectList)}/>
}