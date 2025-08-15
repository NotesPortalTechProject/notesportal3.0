"use client";
import { FaUser, FaLock } from "react-icons/fa";
import { login_with_password } from "@/actions/auth-actions";
import Link from "next/link";
import { useActionState } from "react";
import Particles from "@/components/effects/particles";

export default function LoginPage() {
  const [formState, formAction] = useActionState(login_with_password, {});

  return (
    <div className="relative bg-black min-h-screen w-full flex flex-col items-center justify-center px-4 overflow-hidden">

      <div className="absolute inset-0 z-0">
        <Particles
          particleCount={600} particleSpread={12} speed={0.15}
          particleColors={["#a855f7", "#8b5cf6", "#c084fc", "#f5d0fe"]}
          moveParticlesOnHover particleHoverFactor={4} alphaParticles
          particleBaseSize={320} sizeRandomness={0.7} cameraDistance={35}
          disableRotation={false} className="pointer-events-none"
        />
      </div>

      <h1 className="z-20 text-3xl sm:text-5xl font-medium text-white mb-6 sm:mt-8 mt-4 tracking-tight px-6 py-3 text-center border border-purple-500/20 rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.5)] bg-gradient-to-tr from-black/90 via-[#2a1a3d]/70 to-[#3d1f5e]/60 backdrop-blur-2xl">
        welcome to notesportal
      </h1>

      <div className="z-20 w-full max-w-5xl flex flex-col items-center justify-center gap-8 px-4 py-6">
        <div className="w-full max-w-lg animate-fade-in-up backdrop-blur-2xl bg-gradient-to-br from-[#1a1a1a]/90 via-[#2a1a3d]/70 to-[#3d1f5e]/60 border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.15)] p-8 rounded-2xl flex flex-col items-center justify-center text-white">

          <div className="w-full mb-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)] text-center">
            <p className="text-sm text-purple-200 font-medium">
              Use <span className="text-pink-300 font-semibold">Pass@123</span> as a temporary password to access your NotesPortal account.
            </p>
          </div>

          <form className="flex flex-col gap-6 w-full" action={formAction}>
            <div>
              <label htmlFor="username" className="block mb-2 text-sm text-purple-300 font-medium">
                Username or Email-Id
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-purple-400">
                  <FaUser />
                </span>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username or email id"
                  required
                  className="w-full bg-white/5 border border-purple-500/10 text-white placeholder-gray-400 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm text-purple-300 font-medium">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-purple-400">
                  <FaLock />
                </span>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  className="w-full bg-white/5 border border-purple-500/10 text-white placeholder-gray-400 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-800 py-2 rounded-lg transition"
            >
              Submit
            </button>

            {formState?.errors?.length > 0 && (
              <ul className="text-sm text-red-400 mt-2 space-y-1">
                {formState.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-gray-300">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-purple-400 hover:underline">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
