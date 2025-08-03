import ResetPasswordModal from "@/components/password-managers/reset-password";
import SetPasswordModal from "@/components/password-managers/set-password";
import SubjectCardsDisplay from "@/components/subject-cards/subject-card-display";
import { getUserData } from "@/lib/data-fetch-functions";

export default async function ProfilePage({ params }) {
  const userid = await params.id;
  const userdata = await getUserData(userid);
  const subjectlist = JSON.parse(userdata.subjects);
  return (
    <>
      <div className="p-6 mb-6 border-b border-white/20">
        <h1 className="text-4xl font-bold tracking-tight text-white">My Profile</h1>
      </div>

      <div className="w-full flex flex-col md:flex-row items-start justify-between gap-6 px-6 mb-8">
        <div className="w-full md:w-2/3 p-6 border border-white/20 rounded-2xl bg-white/5 shadow-md">
          <p className="text-lg font-medium text-white mb-2">
            {userdata.firstname} {userdata.lastname}
          </p>
          <p className="text-md text-white/80 mb-1">@{userdata.username}</p>
          <p className="text-md text-white/70">{userdata.email}</p>
        </div>
        <div className="w-full md:w-1/3 p-6 border border-white/20 rounded-2xl bg-white/5 shadow-md text-center">
          <p className="text-lg text-white/80 mb-2">No. of Subjects</p>
          <p className="text-6xl font-extrabold text-white">{subjectlist.length}</p>
        </div>
      </div>

      <div className="p-6 mb-8 border border-white/20 rounded-2xl bg-white/5 shadow-md">
        <p className="text-lg font-semibold text-white mb-4">Manage Password</p>
        <div className="flex flex-wrap gap-4">
          {!userdata.password && (
            <SetPasswordModal id={userid}/>
          )}
          {userdata.password && (
            <ResetPasswordModal id={userid}/>
          )}
        </div>
      </div>


      <div className="px-6">
        <h2 className="text-2xl font-semibold text-white mb-2">My Subjects</h2>
        <SubjectCardsDisplay id={userid} />
      </div>
    </>
  );
}
