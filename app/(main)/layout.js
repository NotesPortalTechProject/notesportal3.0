import HorizontalNavbar from "@/components/navbar-horizontal";
import VerticalNavbar from "@/components/navbar-vertical";


export default function MainLayout({ children }) {
    return (
        <div className="flex flex-col h-screen">
            <HorizontalNavbar/>
            <div className="flex flex-1">
                <VerticalNavbar/>
                <main className="flex-1 p-4">
                    {children}
                </main>
            </div>
        </div>
    );
}
