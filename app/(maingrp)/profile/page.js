import UploadBadges from "@/components/badges/upload-badges";
import ResetPasswordModal from "@/components/password-managers/reset-password";
import SetPasswordModal from "@/components/password-managers/set-password";
import SubjectCardsDisplay from "@/components/subject-cards/subject-card-display";
import { getMyFiles, getUserData } from "@/lib/data-fetch-functions";
import { getUserIdContext } from "../context/userProvider";

export default async function ProfilePage({ params }) {
  const userid = getUserIdContext()
  const userdata = await getUserData(userid);
  const subjectlist = JSON.parse(userdata.subjects);
  const myFilesList = await getMyFiles(userid);

  return (
    <div className="px-6 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-white/20 pb-4">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          My Profile
        </h1>
      </div>

      {/* Row 1: User Info */}
      <div className="w-full p-6 border border-white/20 rounded-2xl bg-white/5 shadow-md space-y-2">
        <p className="text-lg font-medium text-white">
          {userdata.firstname} {userdata.lastname}
        </p>
        <p className="text-md text-white/80">@{userdata.username}</p>
        <p className="text-md text-white/70">{userdata.email}</p>
      </div>

      {/* Row 2: Subject Count + My Files Count */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2 p-6 border border-white/20 rounded-2xl bg-white/5 shadow-md flex flex-col items-center justify-center text-center space-y-2">
          <p className="text-lg text-white/80">No. of Subjects</p>
          <p className="text-6xl font-extrabold text-white">{subjectlist.length}</p>
        </div>
        <div className="w-full md:w-1/2 p-6 border border-white/20 rounded-2xl bg-white/5 shadow-md flex flex-col items-center justify-center text-center space-y-2">
          <p className="text-lg text-white/80">My Files</p>
          <p className="text-6xl font-extrabold text-white">{myFilesList.length}</p>
        </div>
      </div>

      {/* Row 3: Password Management */}
      <div className="p-6 border border-white/20 rounded-2xl bg-white/5 shadow-md space-y-4">
        <p className="text-lg font-semibold text-white">Manage Password</p>
        <div className="flex flex-wrap gap-4">
          {!userdata.password && <SetPasswordModal id={userid} />}
          {userdata.password && <ResetPasswordModal id={userid} />}
        </div>
      </div>

      {/* Row 4: Badges */}
      <div className="p-6 border border-white/20 rounded-2xl bg-white/5 shadow-md space-y-4">
      <div>
        <p className="text-lg font-semibold text-white">Badges</p>
        <p className="text-sm text-gray-400">start uploading files to get badges</p>
      </div>
        <div className="flex flex-wrap gap-4">
          <UploadBadges noofuploads={myFilesList.length}/>
        </div>
      </div>

      {/* Subject List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">My Subjects</h2>
        <SubjectCardsDisplay id={userid} />
      </div>
    </div>
  );
}
