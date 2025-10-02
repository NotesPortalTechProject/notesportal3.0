import { FiUpload, FiStar, FiAward, FiShield } from "react-icons/fi";

export default function UploadBadges({ noofuploads }) {
  const baseClasses =
    "flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg backdrop-blur-md bg-white/10 border border-white/20 transition-transform hover:scale-105 text-sm";

  if (noofuploads >= 100) {
    return (
      <div className={`${baseClasses} bg-gradient-to-r from-gray-800 to-black text-white flex-wrap justify-center`}>
        <FiAward className="w-5 h-5" />
        <span className="font-bold">Uploader V</span>
        <span className="bg-white text-gray-800 rounded-full px-2 py-0.5 text-xs sm:text-sm">100+</span>
      </div>
    );
  } else if (noofuploads >= 75) {
    return (
      <div className={`${baseClasses} bg-gradient-to-r from-pink-500 to-red-500 text-white flex-wrap justify-center`}>
        <FiShield className="w-5 h-5" />
        <span className="font-bold">Uploader IV</span>
        <span className="bg-white text-pink-600 rounded-full px-2 py-0.5 text-xs sm:text-sm">75+</span>
      </div>
    );
  } else if (noofuploads >= 50) {
    return (
      <div className={`${baseClasses} bg-gradient-to-r from-yellow-400 to-orange-500 text-white flex-wrap justify-center`}>
        <FiAward className="w-5 h-5" />
        <span className="font-bold">Uploader III</span>
        <span className="bg-white text-yellow-600 rounded-full px-2 py-0.5 text-xs sm:text-sm">50+</span>
      </div>
    );
  } else if (noofuploads >= 25) {
    return (
      <div className={`${baseClasses} bg-gradient-to-r from-green-400 to-teal-500 text-white flex-wrap justify-center`}>
        <FiStar className="w-5 h-5" />
        <span className="font-bold">Uploader II</span>
        <span className="bg-white text-green-600 rounded-full px-2 py-0.5 text-xs sm:text-sm">25+</span>
      </div>
    );
  } else if (noofuploads >= 10) {
    return (
      <div className={`${baseClasses} bg-gradient-to-r from-indigo-400 to-purple-500 text-white flex-wrap justify-center`}>
        <FiUpload className="w-5 h-5" />
        <span className="font-bold">Uploader I</span>
        <span className="bg-white text-indigo-600 rounded-full px-2 py-0.5 text-xs sm:text-sm">10+</span>
      </div>
    );
  } else {
    return (
      <div className={`${baseClasses} bg-gray-200/20 text-gray-700 flex-wrap justify-center`}>
        <FiUpload className="w-5 h-5" />
        <span className="font-bold">No Badge Yet</span>
        <span className="bg-gray-400 text-white rounded-full px-2 py-0.5 text-xs sm:text-sm">{noofuploads}</span>
      </div>
    );
  }
}
