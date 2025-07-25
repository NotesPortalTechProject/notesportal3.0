import Link from "next/link";

export default function VerticalNavbar({id}) {
    return (
        <div className="w-64 bg-gray-200 flex flex-col justify-between h-full">
            <div>
                <nav className="flex flex-col p-4 space-y-2">
                    <Link href={`/${id}/home`}>Home</Link>
                </nav>
            </div>
            <div className="p-4">
                <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded">
                    Logout
                </button>
            </div>
        </div>
    );
}
