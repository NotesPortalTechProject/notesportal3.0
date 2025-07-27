import Link from "next/link";
import { FiHome, FiUpload, FiUser, FiStar, FiDelete, FiPlusCircle } from "react-icons/fi";

export default function VerticalSidebar({ id }) {
  return (
    <div className="h-screen w-64 bg-[#0d0b14]/60 backdrop-blur-md border-r border-purple-500/20 text-white p-4 flex flex-col justify-between">

      <div>
        {/* <div className="text-xl font-bold text-purple-300 mb-6 px-2">NotesPortal</div> */}

        <nav className="flex flex-col gap-3 mt-6">
          <NavItem icon={<FiHome />} label="Home" id={id} endpoint={'home'}/>
          <NavItem icon={<FiStar />} label="Favorites" id={id} endpoint={'favorites'}/>
          <NavItem icon={<FiUpload />} label="Upload" id={id} endpoint={'upload'}/>
          <NavItem icon={<FiPlusCircle />} label="Add Subjects" id={id} endpoint={'addsubjects'}/>
          <NavItem icon={<FiDelete />} label="Remove Subjects" id={id} endpoint={'removesubjects'}/>
          <NavItem icon={<FiUser />} label="Profile" id={id} endpoint={'profile'}/>
        </nav>
      </div>

      <div className="text-center text-sm text-white/60 mt-4">© 2025 NotesPortal</div>
    </div>
  );
}

function NavItem({ icon, label, id ,endpoint}) {
  return (
    <>
    <Link href={`/${id}/${endpoint}`}>
      <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-800/20 cursor-pointer transition">
        <div className="text-purple-300">{icon}</div>
        <span className="text-white font-medium">{label}</span>
      </div>
    </Link>
    </>
  );
}
