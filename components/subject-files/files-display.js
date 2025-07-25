import { getSubjectFiles } from "@/lib/data-fetch-functions";
import FilesGrid from "./files-grid";

export default async function FilesDisplay({subject}){
    const filesdata = await getSubjectFiles(subject)
    return <FilesGrid data={filesdata}/>
}