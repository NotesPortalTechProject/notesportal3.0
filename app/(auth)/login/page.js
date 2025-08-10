"use client";
import { FaUser, FaLock } from "react-icons/fa";
import { login_with_password } from "@/actions/auth-actions";
import Link from "next/link";
import { useActionState } from "react";
import Particles from "@/components/effects/particles"; // Make sure this path is correct

export default function LoginPage() {
  const [formState, formAction] = useActionState(login_with_password, {});

  return (
    <div className="relative bg-black min-h-screen w-full flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleCount={600} // Reduced to improve clarity and performance
          particleSpread={12} // Tighter grouping
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
      {/* Heading */}
      <h1 className="z-20 text-3xl animate-fade-in-down sm:text-5xl font-meidum text-white mb-6 sm:mt-8 mt-4 tracking-tight px-4 py-2 text-center border border-purple-600 rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.5)] bg-gradient-to-tr from-black via-gray-900 to-purple-900">
        welcome to notesportal
      </h1>

      {/* Main Container */}
      <div className="z-20 w-full max-w-5xl flex flex-col items-center justify-center gap-8 px-4 py-6">
        {/* Login Form Card */}
        <div className="w-full max-w-lg animate-fade-in-up bg-black/50 backdrop-blur-md border border-purple-700 p-8 rounded-xl shadow-[0_0_25px_rgba(168,85,247,0.2)] flex flex-col items-center justify-center">
          <p className="text-right text-sm text-purple-500 underline underline-offset-4 mb-6">
            <Link href="/login/with-otp">Login with OTP</Link>
          </p>

          <form className="flex flex-col gap-6 w-full" action={formAction}>
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm text-purple-300 font-medium"
              >
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-purple-400">
                  <FaUser />
                </span>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  required
                  className="w-full bg-[#2b2b30] border border-purple-700 text-white placeholder-gray-400 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm text-purple-300 font-medium"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-pink-400">
                  <FaLock />
                </span>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  className="w-full bg-[#2b2b30] border border-purple-700 text-white placeholder-gray-400 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
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
            <Link href="/signup" className="text-blue-400 hover:underline">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
