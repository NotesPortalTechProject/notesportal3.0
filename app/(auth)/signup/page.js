"use client";
import { signup } from "@/actions/auth-actions";
import Link from "next/link";
import { useActionState, useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaKey, FaListOl } from "react-icons/fa";
import Particles from "@/components/effects/particles";

export default function SignupPage() {
  const [noOfSubjects, setNoOfSubjects] = useState(0);
  const [formState, formAction] = useActionState(signup, {});

  function handleSubjectsChange(event) {
    const value = parseInt(event.target.value, 10);
    setNoOfSubjects(isNaN(value) ? 0 : value);
  }

  return (
    <div className="relative bg-black h-screen w-full flex flex-col items-center justify-start px-4 overflow-y-auto scrollbar-hide">
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleCount={600}
          particleSpread={12}
          speed={0.15}
          particleColors={["#a855f7", "#8b5cf6", "#c084fc", "#f5d0fe"]}
          moveParticlesOnHover={true}
          particleHoverFactor={4}
          alphaParticles={true}
          particleBaseSize={320}
          sizeRandomness={0.7}
          cameraDistance={35}
          disableRotation={false}
          className="pointer-events-none"
        />
      </div>

      <div className="w-full max-w-5xl flex flex-col items-center justify-center gap-8 px-4 py-6 z-10">
      <h1 className="z-20 text-3xl sm:text-5xl font-medium text-white mb-6 sm:mt-8 mt-4 tracking-tight px-6 py-3 text-center border border-purple-500/20 rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.5)] bg-gradient-to-tr from-black/90 via-[#2a1a3d]/70 to-[#3d1f5e]/60 backdrop-blur-2xl">
        signup to notesportal
      </h1>
        <div className="w-full max-w-lg animate-fade-in-up bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a1a3d]/60 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.08)] flex flex-col items-center justify-start overflow-y-auto max-h-[80vh] scrollbar-hide">
          <form className="flex flex-col gap-6 w-full" action={formAction}>
            <div>
              <label htmlFor="name" className="block mb-2 text-sm text-purple-300 font-medium">
                Firstname
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-purple-400">
                  <FaUser />
                </span>
                <input
                  type="text"
                  id="name"
                  name="firstname"
                  required
                  className="w-full bg-white/5 border border-purple-700/50 text-white placeholder-gray-400 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="lastname" className="block mb-2 text-sm text-purple-300 font-medium">
                Lastname
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-purple-400">
                  <FaUser />
                </span>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  required
                  className="w-full bg-white/5 border border-purple-700/50 text-white placeholder-gray-400 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block mb-2 text-sm text-purple-300 font-medium">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-purple-400">
                  <FaUser />
                </span>
                <input
                  type="text"
                  id="username"
                  name="username"
                  required
                  className="w-full bg-white/5 border border-purple-700/50 text-white placeholder-gray-400 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 text-sm text-purple-300 font-medium">
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-purple-400">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full bg-white/5 border border-purple-700/50 text-white placeholder-gray-400 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm text-purple-300 font-medium">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-pink-400">
                  <FaLock />
                </span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="w-full bg-white/5 border border-purple-700/50 text-white placeholder-gray-400 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm_password" className="block mb-2 text-sm text-purple-300 font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-pink-400">
                  <FaKey />
                </span>
                <input
                  type="password"
                  id="confirm_password"
                  name="confirmpassword"
                  required
                  className="w-full bg-white/5 border border-purple-700/50 text-white placeholder-gray-400 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="no_of_subjects" className="block mb-2 text-sm text-purple-300 font-medium">
                Number of Subjects
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-purple-400">
                  <FaListOl />
                </span>
                <input
                  type="number"
                  id="no_of_subjects"
                  name="nsubjects"
                  value={noOfSubjects}
                  onChange={handleSubjectsChange}
                  required
                  className="w-full bg-white/5 border border-purple-700/50 text-white placeholder-gray-400 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            {Array.from({ length: noOfSubjects }, (_, index) => (
              <div key={index}>
                <label
                  htmlFor={`subject${index}`}
                  className="block mb-1 text-sm text-white/80"
                >
                  Subject {index + 1}:
                </label>
                <input
                  type="text"
                  name={`subject${index}`}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a78bfa] focus:border-transparent transition"
                />
              </div>
            ))}

            <button
              type="submit"
              className="bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-transparent hover:border-purple-500/50"
            >
              Signup
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
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}