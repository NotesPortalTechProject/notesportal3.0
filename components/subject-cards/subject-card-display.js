import { getUserSubjectList } from "@/lib/data-fetch-functions";
import SubjectCards from "./subject-cards";

export default async function SubjectCardsDisplay({id}){
    const subjectlist = await getUserSubjectList(id);
    return <SubjectCards subjects={JSON.parse(subjectlist)}id={id}/>
}