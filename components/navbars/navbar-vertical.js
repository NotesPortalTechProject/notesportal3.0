"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiUpload, FiUser, FiStar } from "react-icons/fi";

export default function VerticalSidebar({ id }) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-screen w-64 bg-black/40 backdrop-blur-md border-r border-purple-500/20 text-white p-4 flex-col justify-between shadow-[0_0_20px_rgba(168,85,247,0.15)]">
        <div>
          <nav className="flex flex-col gap-3 mt-6">
            <NavItem
              icon={<FiHome />}
              label="Home"
              id={id}
              endpoint="home"
              pathname={pathname}
            />
            <NavItem
              icon={<FiStar />}
              label="Favorites"
              id={id}
              endpoint="favorites"
              pathname={pathname}
            />
            <NavItem
              icon={<FiUpload />}
              label="Upload"
              id={id}
              endpoint="upload"
              pathname={pathname}
            />
            <NavItem
              icon={<FiUser />}
              label="Profile"
              id={id}
              endpoint="profile"
              pathname={pathname}
            />
          </nav>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-between items-center bg-black/40 backdrop-blur-md border-t border-purple-500/20 text-white px-4 py-2 shadow-[0_0_20px_rgba(168,85,247,0.15)] lg:hidden">
        <BottomNavItem
          icon={<FiHome />}
          label="Home"
          id={id}
          endpoint="home"
          pathname={pathname}
        />
        <BottomNavItem
          icon={<FiStar />}
          label="Favorites"
          id={id}
          endpoint="favorites"
          pathname={pathname}
        />
        <BottomNavItem
          icon={<FiUpload />}
          label="Upload"
          id={id}
          endpoint="upload"
          isFAB
          pathname={pathname}
        />
        <BottomNavItem
          icon={<FiUser />}
          label="Profile"
          id={id}
          endpoint="profile"
          pathname={pathname}
        />
      </div>
    </>
  );
}

// DESKTOP ITEM
function NavItem({ icon, label, id, endpoint, pathname }) {
  const active = pathname.includes(`/${id}/${endpoint}`);
  return (
    <Link href={`/${id}/${endpoint}`}>
      <div
        className={`
        group relative flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition-all duration-200
        border 
${
  active
    ? "bg-gradient-to-tr from-purple-700/30 to-purple-900/10 text-purple-200 border-purple-500/20 shadow-[inset_0_0_6px_rgba(168,85,247,0.2),0_0_10px_rgba(168,85,247,0.3)]"
    : "border-transparent hover:bg-purple-700/10 hover:text-purple-200"
}

      `}
      >
        <div
          className={`
          text-lg z-10 transition-all duration-300
          ${
            active
              ? "text-purple-300 scale-110 drop-shadow-[0_0_6px_#a855f7]"
              : "text-purple-400"
          }
        `}
        >
          {icon}
        </div>
        <span className="font-semibold tracking-wide z-10">{label}</span>
      </div>
    </Link>
  );
}

// MOBILE ITEM
function BottomNavItem({ icon, label, id, endpoint, isFAB, pathname }) {
  const active = pathname.includes(`/${id}/${endpoint}`);
  return (
    <Link href={`/${id}/${endpoint}`}>
      <div
        className={`
        relative flex flex-col items-center justify-center transition-all duration-200
        ${
          isFAB
            ? `p-3 rounded-full -mt-8 z-10 
             ${
               active
                 ? "bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.6)] scale-105"
                 : "bg-purple-600 hover:scale-110"
             }`
            : `px-2 py-1
             ${
               active
                 ? "text-purple-300 font-semibold before:content-[''] before:absolute before:w-10 before:h-10 before:rounded-full before:bg-purple-500/10 before:blur-md before:animate-pulse before:z-0"
                 : "hover:text-purple-300"
             }
          `
        }
      `}
      >
        <div
          className={`text-xl sm:text-2xl z-10 ${
            active
              ? "text-purple-300 drop-shadow-[0_0_4px_#a855f7]"
              : "text-purple-400"
          }`}
        >
          {icon}
        </div>
        <span className="hidden sm:block text-xs mt-1 z-10">{label}</span>
      </div>
    </Link>
  );
}
