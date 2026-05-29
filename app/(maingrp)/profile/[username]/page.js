import UploadBadges from "@/components/badges/upload-badges";
import { getMyFiles, getUserData, getUserDataByUsername } from "@/lib/data-fetch-functions";
import LoadingDots from "@/components/loadingDots";
import MyFilesDisplay from "@/components/my-files/my-files-display";
import { Suspense } from "react";
import Image from "next/image";
export default async function otherUserProfilePage({ params }) {
    const username = await params.username;
    const userdata = await getUserDataByUsername(username)
    const subjectlist = JSON.parse(userdata.subjects);
    const userfiles = await getMyFiles(userdata.id);
    return (
        <div className="px-6 py-8 space-y-10">
            {/* Row 1: User Info */}
            <div className="flex flex-col md:flex-row gap-6">

                <div className="w-full md:w-auto flex-shrink-0">
                    <Image
                        src={`/profileicons/${userdata.profile_icon}.jpg`}
                        height={150}
                        width={150}
                        alt="profile icon"
                        className="rounded-2xl w-full md:w-auto h-full object-cover"
                    />
                </div>

                <div className="w-full p-6 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-xl shadow-xl">
                    {/* Header */}
                    <div className="border-b border-white/10 pb-5">
                        <h1 className="text-2xl font-semibold tracking-tight text-white">
                            Profile
                        </h1>
                        <p className="text-xs text-white/50 mt-1">
                            account information
                        </p>
                    </div>

                    <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <p className="text-sm tracking-wider text-white/40">
                                fullname
                            </p>
                            <p className="text-xl font-medium text-white">
                                {userdata.firstname} {userdata.lastname}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm tracking-wider text-white/40">
                                username
                            </p>
                            <p className="text-xl font-medium text-white">
                                <span className="text-green-400">@</span>{userdata.username}
                            </p>
                        </div>

                        <div className="space-y-1 md:col-span-2">
                            <p className="text-sm tracking-wider text-white/40">
                                emailaddress
                            </p>
                            <p className="text-xl font-medium text-white break-all">
                                {userdata.email}
                            </p>
                        </div>

                    </div>
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