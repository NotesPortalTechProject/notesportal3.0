"use client";
import { FaUser, FaLock } from "react-icons/fa";
import { login_with_password } from "@/actions/auth-actions";
import Link from "next/link";
import { useActionState } from "react";
import Particles from "@/components/effects/particles";
import LoadingDots from "@/components/loadingDots";

export default function LoginPage() {
  const [formState, formAction,isPending] = useActionState(login_with_password, {});

  return (
    <div className="relative bg-black min-h-screen w-full flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleCount={300} // Reduced to improve clarity and performance
          particleSpread={15} // Tighter grouping
          speed={0.15} // Slower, calming movement
          particleColors={["#a855f7", "#8b5cf6", "#c084fc", "#f5d0fe"]} // Softer purples + lavender
          moveParticlesOnHover={true}
          particleHoverFactor={4} // Slightly stronger response on hover
          alphaParticles={true}
          particleBaseSize={320} // Slightly smaller
          sizeRandomness={0.7} // Less jittery
          cameraDistance={35} // Slightly farther back for smoother layout
          disableRotation={false}
          className="pointer-events-none"
        />
      </div>

      {/* Title */}
      <h1 className="z-20 text-3xl sm:text-5xl font-medium text-white mb-6 sm:mt-8 mt-4 tracking-tight px-6 py-3 text-center rounded-2xl shadow-[0_0_12px_rgba(168,85,247,0.3)] bg-gradient-to-br from-[#1a1a1a]/10 to-[#2a1a3d]/30 border border-purple-500/20">
        welcome to notesportal
      </h1>

      <div className="z-20 w-full max-w-5xl flex flex-col items-center justify-center gap-8 px-4 py-6">
        {/* Login card (landing-page style) */}
        <div className="relative w-full max-w-lg p-8 rounded-2xl bg-gradient-to-br from-[#1a1a1a]/10 to-[#2a1a3d]/30 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.1)] flex flex-col items-center justify-center text-white">
          {/* Info banner */}
          <div className="w-full mb-6 p-4 rounded-xl bg-[#1a1a1a]/80 border border-purple-500/20 text-center">
            <p className="text-center text-sm text-purple-200">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-purple-400 hover:underline">
                Signup
              </Link>
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-6 w-full" action={formAction}>
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm text-purple-300 font-medium"
              >
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
                  className="w-full bg-[#1a1a1a]/70 border border-purple-500/20 text-white placeholder-purple-300 rounded-xl px-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm text-purple-300 font-medium"
              >
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
                  className="w-full bg-[#1a1a1a]/70 border border-purple-500/20 text-white placeholder-purple-300 rounded-xl px-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 py-2 rounded-xl shadow-[0_0_20px_#9333ea40] text-white font-semibold transition-all hover:scale-[1.03]"
            >
              {isPending ? <LoadingDots text="verifying"/>:"Login"}
            </button>

            {/* Errors */}
            {formState?.errors?.length > 0 && (
              <ul className="text-sm text-red-400 mt-2 space-y-1">
                {formState.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            )}
          </form>

          {/* Signup link */}
          <p className="mt-6 text-center text-sm text-purple-200">
            forgot password? {" "}
            <Link href="/login/with-otp" className="text-purple-400 hover:underline">
              login with otp
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
