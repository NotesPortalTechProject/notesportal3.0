export default function HorizontalNavbar() {
    return (
        <>
            <div className="w-full p-4 flex items-center justify-between bg-gray-800 text-white shadow-md">
                <div className="text-xl font-semibold">
                    NotesPortal
                </div>
                <div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                        User Profile
                    </button>
                </div>
            </div>
        </>
    );
}
