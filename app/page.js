import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="w-full h-screen flex flex-col items-center justify-center relative text-3xl">
        <p>NotesPortal</p>
        <Link href={'/signup'} >Sign-Up</Link>
        <Link href={'/login'}>Login</Link>
      </div>
    </>
  );
}
