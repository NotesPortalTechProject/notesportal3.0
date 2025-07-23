import Link from "next/link";
import './globals.css';
export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center landing-page px-4">
      <div className="glass p-6 md:p-8 rounded-lg text-center max-w-full">
        <p className="text-5xl md:text-9xl font-semibold text-white">notesportal</p>
      </div>
      <div className="mt-4 text-white italic text-xl text-center">
        <p>your hub for mpstme notes</p>
      </div>
      <div className="mt-6 flex flex-col md:flex-row gap-2 md:gap-4 text-lg">
        <Link href="/signup" className="glass-button">sign-up</Link>
        <Link href="/login" className="glass-button">login</Link>
      </div>
    </div>
  );
}
