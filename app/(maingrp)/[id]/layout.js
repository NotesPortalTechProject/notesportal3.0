import HorizontalNavbar from "@/components/navbars/navbar-horizontal";
import VerticalNavbar from "@/components/navbars/navbar-vertical";

export default async function MainLayout({ children, params }) {
  const userid = await params.id;
    return (
        <div className="flex flex-col h-screen bg-[#0d0b14] text-white">
            <HorizontalNavbar id={userid}/>
            <div className="flex flex-1 overflow-hidden">
                <VerticalNavbar id={userid}/>
                <main className="flex-1 overflow-y-auto p-6 bg-[#1a1a1a] scrollbar-thin scrollbar-thumb-purple-700/50 scrollbar-track-transparent">
                    {children}
                </main>
            </div>
        </div>
    );
}
