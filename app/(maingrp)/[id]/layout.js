import HorizontalNavbar from "@/components/navbars/navbar-horizontal";
import VerticalNavbar from "@/components/navbars/navbar-vertical";
import { getUserData } from "@/lib/data-fetch-functions";

export default async function MainLayout({ children, params }) {
  const userid = await params.id;
  const userdata = await getUserData(userid)
    return (
        <div className="flex flex-col h-screen bg-[#0d0b14] text-white">
            <HorizontalNavbar id={userid}/>
            <div className="flex flex-1 overflow-hidden">
                <VerticalNavbar id={userid} subjectlist={JSON.parse(userdata['subjects'])}/>
                <main className="flex-1 overflow-y-auto p-6 bg-[#1a1a1a] scrollbar-hide">
                    {children}
                </main>
            </div>
        </div>
    );
}
