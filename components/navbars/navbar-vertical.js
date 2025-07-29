import Link from "next/link";
import {
  FiHome,
  FiUpload,
  FiUser,
  FiStar,
  FiDelete,
  FiPlusCircle,
} from "react-icons/fi";

export default function VerticalSidebar({ id }) {
  return (
    <>
      {/* Desktop Vertical Sidebar */}
      <div className="hidden lg:flex h-screen w-64 bg-black/40 backdrop-blur-md border-r border-purple-500/30 text-white p-4 flex-col justify-between shadow-[0_0_20px_rgba(168,85,247,0.15)]">
        <div>
          {/* <div className="text-xl font-bold text-purple-400 mb-6 px-2 tracking-wide">NotesPortal</div> */}
          <nav className="flex flex-col gap-3 mt-6">
            <NavItem icon={<FiHome />} label="Home" id={id} endpoint="home" />
            <NavItem icon={<FiStar />} label="Favorites" id={id} endpoint="favorites" />
            <NavItem icon={<FiUpload />} label="Upload" id={id} endpoint="upload" />
            <NavItem icon={<FiPlusCircle />} label="Add Subjects" id={id} endpoint="addsubjects" />
            <NavItem icon={<FiDelete />} label="Remove Subjects" id={id} endpoint="removesubjects" />
            <NavItem icon={<FiUser />} label="Profile" id={id} endpoint="profile" />
          </nav>
        </div>
        <div className="text-center text-xs text-white/50 mt-4">© 2025 NotesPortal</div>
      </div>

      {/* Mobile/Tablet Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-between items-center bg-black/40 backdrop-blur-md border-t border-purple-500/30 text-white px-4 py-2 shadow-[0_0_20px_rgba(168,85,247,0.15)] lg:hidden">
        <BottomNavItem icon={<FiHome />} label="Home" id={id} endpoint="home" />
        <BottomNavItem icon={<FiStar />} label="Favorites" id={id} endpoint="favorites" />
        <BottomNavItem icon={<FiUpload />} label="Upload" id={id} endpoint="upload" isFAB />
        <BottomNavItem icon={<FiUser />} label="Profile" id={id} endpoint="profile" />
        <BottomNavItem icon={<FiPlusCircle />} label="Add" id={id} endpoint="addsubjects" />
      </div>
    </>
  );
}

// Vertical Sidebar Item
function NavItem({ icon, label, id, endpoint }) {
  return (
    <Link href={`/${id}/${endpoint}`}>
      <div className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-purple-500/20 hover:text-purple-200 transition-all duration-200 cursor-pointer">
        <div className="text-purple-400 text-lg">{icon}</div>
        <span className="font-medium text-white tracking-wide">{label}</span>
      </div>
    </Link>
  );
}

// Bottom Navbar Item
function BottomNavItem({ icon, label, id, endpoint, isFAB }) {
  return (
    <Link href={`/${id}/${endpoint}`}>
      <div
        className={`flex flex-col items-center justify-center transition-all duration-200 
        ${isFAB
            ? "bg-purple-600 p-3 rounded-full text-white -mt-8 shadow-lg hover:scale-110"
            : "hover:text-purple-300 px-2"
          }`}
      >
        <div className={`text-xl sm:text-2xl ${isFAB ? "text-white" : "text-purple-400"}`}>
          {icon}
        </div>
        <span className="hidden sm:block text-xs mt-1">{label}</span>
      </div>
    </Link>
  );
}
