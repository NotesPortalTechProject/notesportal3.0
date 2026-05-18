import UploadBadges from "@/components/badges/upload-badges";
import { getMyFiles, getUserData, getUserDataByUsername } from "@/lib/data-fetch-functions";
import LoadingDots from "@/components/loadingDots";
import MyFilesDisplay from "@/components/my-files/my-files-display";
import { Suspense } from "react";
export default async function otherUserProfilePage({ params }) {
    const username = await params.username;
    const userdata = await getUserDataByUsername(username)
    const subjectlist = JSON.parse(userdata.subjects);
    const userfiles = await getMyFiles(userdata.id);
    return (
        <div className="px-6 py-8 space-y-10">
            <div className="border-b border-white/20 pb-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                    Profile
                </h1>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full p-6 border border-white/20 rounded-2xl bg-white/5 shadow-md space-y-2">
                    <p className="text-4xl font-medium text-white">
                        {userdata.firstname} {userdata.lastname}
                    </p>
                    <p className="text-lg text-white/80">@{userdata.username}</p>
                </div>
                <div className="w-full md:w-1/2 p-6 border border-white/20 rounded-2xl bg-white/5 shadow-md flex flex-col items-center justify-center text-center space-y-2">
                    <p className="text-lg text-white/80">Uploads</p>
                    <p className="text-6xl font-extrabold text-white">{userfiles.length}</p>
                </div>
            </div>
            <div className="p-6 border border-white/20 rounded-2xl bg-white/5 shadow-md space-y-4">
                <div>
                    <p className="text-lg font-semibold text-white">Badges</p>
                    <p className="text-sm text-gray-400">start uploading files to get badges</p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <UploadBadges noofuploads={userfiles.length} />
                </div>
            </div>
            <div className="border-b border-white/20 pb-2">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                    Subjects
                </h2>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2 p-6 border border-white/20 rounded-2xl bg-white/5 shadow-md flex flex-col items-center justify-center text-center space-y-2">
                    <p className="text-lg text-white/80">No. of Subjects</p>
                    <p className="text-8xl font-extrabold text-white">{subjectlist.length}</p>
                </div>
                <div className="w-full md:w-1/2 p-6 border border-white/20 rounded-2xl bg-white/5 shadow-md flex flex-col space-y-2">
                    <p className="text-lg text-white/80">Subject List</p>
                    {subjectlist.map((subject, idx) => (<p key={idx} className="text-xl font-bold text-white">{subject}</p>))}
                </div>
            </div>
            <div>
                <Suspense fallback={<LoadingDots text="fetching your files" />}>
                    <MyFilesDisplay id={userdata.id} src={`/home`} type={'otheruser'} />
                </Suspense>
            </div>
        </div>
    )
}