import SubjectCards from "@/components/subject-cards";
import { getUserData } from "@/lib/data-fetch-functions";

export default async function HomePage({params}){
    const userId = params.id
    const userData = await getUserData(userId)
    return(
        <>
        <p>Home Page</p>
        <SubjectCards subjects={JSON.parse(userData.subjects)}/>
        </>
    );
}