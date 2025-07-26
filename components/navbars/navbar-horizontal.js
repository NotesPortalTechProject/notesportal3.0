import { FiSearch, FiUpload } from "react-icons/fi";

export default function HorizontalNavbar({id}) {
  return (
    <div className="w-full px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0d0b14] text-white border-b border-purple-500/30 shadow-md">
      
      {/* Logo */}
      <div className="text-xl font-bold text-purple-300">NotesPortal</div>

      {/* Search Bar */}
      <div className="w-full sm:flex-1 relative">
        <input
          type="text"
          placeholder="Search notes or subjects..."
          className="w-full bg-[#1c1c2c] text-white px-10 py-2 rounded-lg border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-400/40"
        />
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
      </div>

      {/* Upload + Profile */}
      <div className="flex gap-3">
        <button className="flex items-center gap-2 bg-[#170b22] border border-purple-500/40 hover:border-purple-400 text-white px-4 py-2 rounded-lg transition whitespace-nowrap">
          <FiUpload size={18} />
          Upload
        </button>
        <button className="bg-[#170b22] border border-purple-500/40 hover:border-purple-400 text-white px-4 py-2 rounded-lg transition whitespace-nowrap">
          User Profile
        </button>
      </div>
    </div>
  );
}
