import { FiUpload, FiStar, FiAward, FiShield } from "react-icons/fi";

export default function UploadBadges({ noofuploads }) {
  const baseClasses =
    "relative flex items-center justify-center gap-2 px-5 py-3 rounded-2xl shadow-[0_0_25px_rgba(168,85,247,0.15)]  backdrop-blur-xl transition-all duration-300 transform hover:scale-101  text-sm font-semibold text-center";

  const shimmer =
    "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:translate-x-[-200%] hover:before:animate-[shimmer_1.5s_infinite] overflow-hidden";

  if (noofuploads >= 100) {
    return (
      <div
        className={`${baseClasses} ${shimmer} bg-gradient-to-r from-yellow-400/90 via-orange-500/90 to-red-500/90 text-white`}
      >
        <FiAward className="w-6 h-6 drop-shadow-md" />
        <span className="text-base font-bold tracking-wide">Uploader I</span>
        <span className="bg-white/90 text-red-600 rounded-full px-2.5 py-0.5 text-xs sm:text-sm font-bold shadow-md">
          100+
        </span>
      </div>
    );
  } else if (noofuploads >= 50) {
    return (
      <div
        className={`${baseClasses} ${shimmer} bg-gradient-to-r from-fuchsia-500/90 via-pink-500/90 to-rose-500/90 text-white`}
      >
        <FiShield className="w-6 h-6 drop-shadow-md" />
        <span className="text-base font-bold tracking-wide">Uploader II</span>
        <span className="bg-white/90 text-pink-600 rounded-full px-2.5 py-0.5 text-xs sm:text-sm font-bold shadow-md">
          50+
        </span>
      </div>
    );
  } else if (noofuploads >= 25) {
    return (
      <div
        className={`${baseClasses} ${shimmer} bg-gradient-to-r from-cyan-400/90 via-sky-500/90 to-blue-600/90 text-white`}
      >
        <FiStar className="w-6 h-6 drop-shadow-md" />
        <span className="text-base font-bold tracking-wide">Uploader III</span>
        <span className="bg-white/90 text-sky-600 rounded-full px-2.5 py-0.5 text-xs sm:text-sm font-bold shadow-md">
          25+
        </span>
      </div>
    );
  } else if (noofuploads >= 10) {
    return (
      <div
        className={`${baseClasses} ${shimmer} bg-gradient-to-r from-lime-400/90 via-green-500/90 to-emerald-600/90 text-white`}
      >
        <FiUpload className="w-6 h-6 drop-shadow-md" />
        <span className="text-base font-bold tracking-wide">Uploader IV</span>
        <span className="bg-white/90 text-green-600 rounded-full px-2.5 py-0.5 text-xs sm:text-sm font-bold shadow-md">
          10+
        </span>
      </div>
    );
  } else if (noofuploads >= 3) {
    return (
      <div
        className={`${baseClasses} ${shimmer} bg-gradient-to-r from-purple-400/90 via-indigo-500/90 to-violet-600/90 text-white`}
      >
        <FiUpload className="w-6 h-6 drop-shadow-md" />
        <span className="text-base font-bold tracking-wide">Uploader V</span>
        <span className="bg-white/90 text-indigo-600 rounded-full px-2.5 py-0.5 text-xs sm:text-sm font-bold shadow-md">
          3+
        </span>
      </div>
    );
  } else {
    return (
      <div
        className={`${baseClasses} ${shimmer} bg-gradient-to-r from-gray-500/90 via-gray-600/90 to-gray-700/90 text-white`}
      >
        <FiUpload className="w-6 h-6 drop-shadow-md" />
        <span className="text-base font-bold tracking-wide">No Badge Yet</span>
        <span className="bg-white/90 text-gray-700 rounded-full px-2.5 py-0.5 text-xs sm:text-sm font-bold shadow-md">
          {noofuploads}
        </span>
      </div>
    );
  }
}

