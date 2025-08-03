import Link from "next/link";
import { FiCompass, FiSearch, FiUpload, FiUser } from "react-icons/fi";
import ProfileModal from "../profile-modal";
export default function HorizontalNavbar({ id }) {
  return (
    <div className="w-full px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0d0b14] text-white border-b border-purple-500/30 shadow-md">

      {/* Logo */}
      <div className="text-xl font-bold text-purple-300">NotesPortal</div>

      {/* Search Bar */}
      {/* <div className="w-full sm:flex-1 relative">
        <input
          type="text"
          placeholder="Search notes or subjects..."
          className="w-full bg-[#1c1c2c] text-white px-10 py-2 rounded-lg border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-400/40"
        />
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
      </div> */}

      {/* Upload + Profile */}
      {/* FLEX GAP CHANGE KIA HAI */}
      <div className="flex gap-16 items-center">
        <Link href={`/${id}/aboutus`}>about us</Link>
        <ProfileModal id={id}/>
      </div>
    </div>
  );
}
