import Link from "next/link";
import { FiCompass, FiSearch, FiUpload, FiUser } from "react-icons/fi";
import ProfileModal from "../profile-modal";

export default function HorizontalNavbar({ id }) {
  return (
    <div className="w-full px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1a1a1a] border-b border-purple-500/40 text-white">
      
      {/* Top Row: Logo and Profile (mobile-specific spacing) */}
      <div className="w-full flex items-center justify-between sm:justify-start sm:gap-16">
        <div className="text-2xl font-bold text-[#efefef]">notesportal</div>
        <div className="sm:hidden">
          <ProfileModal id={id} />
        </div>
      </div>

      {/* Desktop/Tablet Row: About Us + Profile */}
      <div className="hidden sm:flex gap-16 items-center">
        <Link href={`/${id}/aboutus`}>about us</Link>
        <ProfileModal id={id} />
      </div>
    </div>
  );
}
