export default function VerticalNavbar() {
    return (
        <div className="w-64 bg-gray-200 flex flex-col justify-between h-full">
            <div>
                <nav className="flex flex-col p-4 space-y-2">
                    <a href="#" className="hover:bg-gray-300 p-2 rounded">Dashboard</a>
                    <a href="#" className="hover:bg-gray-300 p-2 rounded">Notes</a>
                    <a href="#" className="hover:bg-gray-300 p-2 rounded">Assignments</a>
                    <a href="#" className="hover:bg-gray-300 p-2 rounded">Groups</a>
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
