import { FiUpload, FiStar, FiAward, FiShield } from "react-icons/fi";

export default function UploadBadges({ noofuploads }) {
  const baseClasses =
    "flex items-center justify-center gap-2 px-4 py-2 rounded-xl shadow-lg backdrop-blur-md border border-white/30 transition-transform hover:scale-110 text-sm font-semibold text-center";

  if (noofuploads >= 100) {
    return (
      <div className={`${baseClasses} bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white`}>
        <FiAward className="w-5 h-5" />
        <span className="font-bold">Uploader I</span>
        <span className="bg-white text-red-600 rounded-full px-2 py-0.5 text-xs sm:text-sm">100+</span>
      </div>
    );
  } else if (noofuploads >= 75) {
    return (
      <div className={`${baseClasses} bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 text-white`}>
        <FiShield className="w-5 h-5" />
        <span className="font-bold">Uploader II</span>
        <span className="bg-white text-pink-600 rounded-full px-2 py-0.5 text-xs sm:text-sm">75+</span>
      </div>
    );
  } else if (noofuploads >= 50) {
    return (
      <div className={`${baseClasses} bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-white`}>
        <FiStar className="w-5 h-5" />
        <span className="font-bold">Uploader III</span>
        <span className="bg-white text-sky-600 rounded-full px-2 py-0.5 text-xs sm:text-sm">50+</span>
      </div>
    );
  } else if (noofuploads >= 25) {
    return (
      <div className={`${baseClasses} bg-gradient-to-r from-lime-400 via-green-500 to-emerald-600 text-white`}>
        <FiUpload className="w-5 h-5" />
        <span className="font-bold">Uploader IV</span>
        <span className="bg-white text-green-600 rounded-full px-2 py-0.5 text-xs sm:text-sm">25+</span>
      </div>
    );
  } else if (noofuploads >= 10) {
    return (
      <div className={`${baseClasses} bg-gradient-to-r from-purple-400 via-indigo-500 to-violet-600 text-white`}>
        <FiUpload className="w-5 h-5" />
        <span className="font-bold">Uploader V</span>
        <span className="bg-white text-indigo-600 rounded-full px-2 py-0.5 text-xs sm:text-sm">10+</span>
      </div>
    );
  } else {
    return (
      <div className={`${baseClasses} bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 text-white`}>
        <FiUpload className="w-5 h-5" />
        <span className="font-bold">No Badge Yet</span>
        <span className="bg-white text-gray-700 rounded-full px-2 py-0.5 text-xs sm:text-sm">{noofuploads}</span>
      </div>
    );
  }
}