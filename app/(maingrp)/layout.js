import HorizontalNavbar from "@/components/navbars/navbar-horizontal";
import VerticalNavbar from "@/components/navbars/navbar-vertical";
import { getUserData } from "@/lib/data-fetch-functions";
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
    return (
        <div className="flex flex-col h-screen bg-[#0d0b14] text-white">
            <HorizontalNavbar id={userSession.userId} />
            <div className="flex flex-1 overflow-hidden">
                <VerticalNavbar id={userSession.userId} subjectlist={JSON.parse(userdata['subjects'])} />
                <main className="flex-1 overflow-y-auto p-6 bg-[#1a1a1a] scrollbar-hide">
                    {React.cloneElement(children,{userId:userSession.userId})}
                </main>
            </div>
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9497779713832911"
                crossorigin="anonymous"></script>
        </div>
    );
}
