import { getSubjectFiles } from "@/lib/data-fetch-functions";
import FilesGrid from "./files-grid";

export default async function FilesDisplay({ subject, id, src}) {
    const filesdataTemp = await getSubjectFiles(subject)
    return <FilesGrid data={filesdataTemp} id={id} src={src} />
}