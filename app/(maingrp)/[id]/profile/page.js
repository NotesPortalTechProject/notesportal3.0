import ResetPasswordModal from "@/components/password-managers/reset-password";
import SetPasswordModal from "@/components/password-managers/set-password";
import SubjectCardsDisplay from "@/components/subject-cards/subject-card-display";
import { getMyFiles, getUserData } from "@/lib/data-fetch-functions";

export default async function ProfilePage({ params }) {
  const userid = await params.id;
  const userdata = await getUserData(userid);
  const subjectlist = JSON.parse(userdata.subjects);
  const myFilesList = await getMyFiles(userid);
  return (
    <div className="px-6 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-white/20 pb-4">
        <h1 className="text-4xl font-bold tracking-tight text-white">My Profile</h1>
      </div>

      {/* Profile Overview */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* User Info */}
        <div className="w-full md:w-2/3 p-6 border border-white/20 rounded-2xl bg-white/5 shadow-md space-y-2">
          <p className="text-lg font-medium text-white">
            {userdata.firstname} {userdata.lastname}
          </p>
          <p className="text-md text-white/80">@{userdata.username}</p>
          <p className="text-md text-white/70">{userdata.email}</p>
        </div>

        {/* Subject Count */}
        <div className="w-full md:w-1/3 p-6 border border-white/20 rounded-2xl bg-white/5 shadow-md flex flex-col items-center justify-center text-center space-y-2">
          <p className="text-lg text-white/80">No. of Subjects</p>
          <p className="text-6xl font-extrabold text-white">{subjectlist.length}</p>
        </div>
      </div>

      {/* Password Management */}
      <div className="p-6 border border-white/20 rounded-2xl bg-white/5 shadow-md space-y-4">
        <p className="text-lg font-semibold text-white">Manage Password</p>
        <div className="flex flex-wrap gap-4">
          {!userdata.password && <SetPasswordModal id={userid} />}
          {userdata.password && <ResetPasswordModal id={userid} />}
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-32 h-32 flex flex-col items-center justify-center rounded-full bg-white/10 border border-white/20 text-white text-center space-y-1 shadow-md">
          <p className="text-sm text-white/80">My Files</p>
          <p className="text-4xl font-extrabold">{myFilesList.length}</p>
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
