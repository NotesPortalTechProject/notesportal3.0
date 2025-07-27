import FilesDisplay from "@/components/subject-files/files-display";
import { Suspense } from "react";

export default async function IndividualSubjectPage({params}){
    const subjectname = await params.subjectSlug;
    const id = await params.id;
    return(
        <>
        <p>My Subjects - {subjectname}</p>
        <Suspense fallback={'Fetching files....'}>
            <FilesDisplay subject={subjectname} id={id} src={`/${id}/subject/${subjectname}`}/>
        </Suspense>
        </>
    );
}