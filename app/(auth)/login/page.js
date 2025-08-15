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
      {/* Background particles */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleCount={950}
          particleSpread={10}
          speed={0.12}
          particleColors={["#a855f7", "#8b5cf6", "#c084fc", "#f5d0fe"]}
          moveParticlesOnHover
          particleHoverFactor={3.5}
          alphaParticles
          particleBaseSize={480}
          sizeRandomness={0.6}
          cameraDistance={40}
          disableRotation={false}
          className="pointer-events-none"
        />
      </div>

      {/* Title */}
      <h1 className="z-20 text-3xl sm:text-5xl font-medium text-white mb-6 sm:mt-8 mt-4 tracking-tight px-6 py-3 text-center border border-white/20 rounded-lg shadow-lg bg-white/10 backdrop-blur-xl">
        welcome to notesportal
      </h1>

      <div className="z-20 w-full max-w-5xl flex flex-col items-center justify-center gap-8 px-4 py-6">
        {/* Glassmorphism login card */}
        <div className="relative w-full max-w-lg animate-fade-in-up bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg p-8 rounded-2xl flex flex-col items-center justify-center text-white overflow-hidden">
          {/* Info banner */}
          <div className="w-full mb-6 p-4 rounded-xl bg-white/10 border border-white/20 text-center relative z-10">
            <p className="text-sm text-purple-200 font-medium">
              Use <span className="text-pink-300 font-semibold">Pass@123</span>{" "}
              as a temporary password to access your NotesPortal account.
            </p>
          </div>

          {/* Form */}
          <form
            className="flex flex-col gap-6 w-full relative z-10"
            action={formAction}
          >
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
                  className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-300 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
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
                  className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-300 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition"
            >
              Submit
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
          <p className="mt-6 text-center text-sm text-gray-300 relative z-10">
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
