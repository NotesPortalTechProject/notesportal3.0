import HorizontalNavbar from "@/components/navbars/navbar-horizontal";
import VerticalNavbar from "@/components/navbars/navbar-vertical";
import { getMyFiles, getUserData } from "@/lib/data-fetch-functions";
import { decrypt } from "@/lib/session";
import { redirect } from "next/dist/server/api-utils";
import { cookies } from "next/headers";

export default async function MainLayout({ children }) {
    const cookie = cookies();
    const session = (await cookie).get("session");

    if (!session) {
        redirect('/login');
    }

    const userSession = await decrypt(session.value);
    const userdata = await getUserData(userSession.userId)
    // TEMP LOGIC NO OF UPLOADS FOR USER LOGIC 
    const myfiles = await getMyFiles(userSession.userId)
    const nuploads = myfiles.length
    return (
        <div className="flex flex-col h-screen bg-[#0d0b14] text-white">
            <HorizontalNavbar id={userSession.userId} userdata={userdata} noOfUploads={nuploads}/>
            <div className="flex flex-1 overflow-hidden">
                <VerticalNavbar id={userSession.userId} subjectlist={JSON.parse(userdata['subjects'])} />
                <main className="flex-1 overflow-y-auto p-6 bg-[#1a1a1a] scrollbar-hide">
                    {children}
                </main>
            </div>
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9497779713832911"
                crossorigin="anonymous"></script>
        </div>
    );
}
