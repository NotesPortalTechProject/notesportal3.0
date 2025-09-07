import { getSubjectFiles } from "@/lib/data-fetch-functions";
import FilesGrid from "./files-grid";

export default async function FilesDisplay({ subject, id, src, filetype }) {
    const filesdata = await getSubjectFiles(subject,filetype)
    return <FilesGrid data={filesdata} id={id} src={src} />
}