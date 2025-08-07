import { IsFileinFav } from "@/actions/other-actions";
import FavFormBtn from "./fav-from-btn";
import FileViewModal from "./subject-files/file-view-modal";
export default async function FileCard({ file, index, userid, src}) {
    const isFav = await IsFileinFav(file.id,userid)
    return (
        <>
            <div
                key={index}
                className="rounded-2xl bg-gradient-to-b from-[#222] to-purple-900/60 p-4 shadow-lg border border-white/10 backdrop-blur-md text-white"
            >
                <div className="overflow-hidden rounded-xl mb-4">
                    <iframe
                        src={file.filelink}
                        className="w-full h-48 rounded-lg border border-white/10"
                    />
                </div>

                <div className='w-full flex items-center justify-end'>
                    <FavFormBtn initialIsFav={isFav} fileid={file.id} userid={userid} src={src}/>
                </div>

                <h2
                    className="text-lg font-bold tracking-wide mb-1 truncate w-full"
                    title={file.filename}
                >
                    {file.filename}
                </h2>
                <p className="text-sm text-gray-300 mb-4 truncate">
                    {file.description}
                </p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-white/30" />
                        <span className="text-sm text-white/80">{file.uploaded_by}</span>
                    </div>
                    <div>
                        <FileViewModal data={file}/>
                    </div>
                </div>
            </div>
        </>
    );

}