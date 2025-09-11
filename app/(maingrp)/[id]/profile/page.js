import ResetPasswordModal from "@/components/password-managers/reset-password";
import SetPasswordModal from "@/components/password-managers/set-password";
import SubjectCardsDisplay from "@/components/subject-cards/subject-card-display";
import { getMyFiles, getUserData } from "@/lib/data-fetch-functions";

export default async function ProfilePage({ params }) {
  const userid = params.id;
  const userdata = await getUserData(userid);
  const subjectlist = JSON.parse(userdata.subjects);
  const myFilesList = await getMyFiles(userid);

  return (
    <div className="min-h-screen px-6 py-10 max-w-7xl mx-auto space-y-10
      bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border border-white/5 shadow-lg rounded-3xl animate-fadeIn">

      {/* Header */}
      <div className="border-b border-white/20 pb-4">
        <h1 className="text-4xl font-bold tracking-tight text-white animate-fadeIn">
          My Profile
        </h1>
      </div>

      {/* Profile Overview */}
      <div className="flex flex-col md:flex-row gap-6 animate-fadeIn delay-75">
        {/* User Info */}
        <div className="flex-1 p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 shadow-md space-y-2 hover:scale-[1.02] transition-transform duration-300">
          <p className="text-lg font-medium text-white">{userdata.firstname} {userdata.lastname}</p>
          <p className="text-md text-white/80">@{userdata.username}</p>
          <p className="text-md text-white/70">{userdata.email}</p>
        </div>

        {/* Subject Count */}
        <div className="w-full md:w-1/3 p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 shadow-md flex flex-col items-center justify-center text-center space-y-2 hover:scale-[1.02] transition-transform duration-300">
          <p className="text-lg text-white/80">No. of Subjects</p>
          <p className="text-6xl font-extrabold text-white">{subjectlist.length}</p>
        </div>
      </div>

      {/* Password Management */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 shadow-md space-y-4 animate-fadeIn delay-100 hover:scale-[1.01] transition-transform duration-300">
        <p className="text-lg font-semibold text-white">Manage Password</p>
        <div className="flex flex-wrap gap-4">
          {!userdata.password && <SetPasswordModal id={userid} />}
          {userdata.password && <ResetPasswordModal id={userid} />}
        </div>
      </div>

      {/* Files Summary */}
      <div className="flex justify-center animate-fadeIn delay-150">
        <div className="w-32 h-32 flex flex-col items-center justify-center rounded-full
          bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10
          text-white text-center space-y-1 shadow-md hover:scale-105 transition-transform duration-300">
          <p className="text-sm text-white/80">My Files</p>
          <p className="text-4xl font-extrabold">{myFilesList.length}</p>
        </div>
      </div>

      {/* Subject List */}
      <div className="space-y-4 animate-fadeIn delay-200">
        <h2 className="text-2xl font-semibold text-white">My Subjects</h2>
        <SubjectCardsDisplay id={userid} />
      </div>
    </div>
  );
}
