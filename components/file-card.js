import { IsFileinFav } from "@/actions/other-actions";
import FavFormBtn from "./fav-from-btn";
import FileViewModal from "./subject-files/file-view-modal";

export default async function FileCard({ file, index, userid, src }) {
    const isFav = await IsFileinFav(file.id, userid);

    return (
        <>
            <div key={index} className="rounded-2xl bg-gradient-to-b from-[#222] to-purple-900/60 p-4 shadow-lg border border-white/10 backdrop-blur-md text-white">
                <div className="overflow-hidden rounded-xl mb-4 hidden lg:block">
                    <iframe src={file.filelink} className="w-full h-40 rounded-lg border border-white/10" />
                </div>
                <div className="mb-2 text-sm text-white/70 lg:hidden">Click Open to check file content</div>

                <div className="w-full flex items-center justify-end mb-2">
                    <FavFormBtn initialIsFav={isFav} fileid={file.id} userid={userid} src={src} />
                </div>

                <h2 className="text-lg font-bold tracking-wide mb-1 truncate w-full" title={file.filename}>{file.filename}</h2>
                <p className="text-sm text-gray-300 mb-4 truncate">{file.description}</p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-white/80 truncate">{file.uploaded_by}</span>
                    </div>
                    <div>
                        <FileViewModal data={file} />
                    </div>
                </div>
            </div>
        </>
    );
}
