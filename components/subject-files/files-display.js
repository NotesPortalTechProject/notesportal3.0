import { getSubjectFiles } from "@/lib/data-fetch-functions";
import FilesGrid from "./files-grid";

export default async function FilesDisplay({ subject, id, src }) {
    const filesdata = await getSubjectFiles(subject)
    return <FilesGrid data={filesdata} id={id} src={src} />
}