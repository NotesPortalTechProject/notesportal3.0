import { getMyFiles } from "@/lib/data-fetch-functions";
import MyFilesGrid from "./my-files-grid";

export default async function MyFilesDisplay({ id, src, type }) {
    const myfiles = await getMyFiles(id)
    return <MyFilesGrid data={myfiles} userid={id} src={src} type={type} />
}