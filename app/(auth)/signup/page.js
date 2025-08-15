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
    <div className="relative bg-black h-screen w-screen flex flex-col items-center justify-start px-4 overflow-hidden">
      {/* Particle Background */}
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

      <div className="w-full max-w-5xl flex flex-col items-center justify-center gap-8 px-4 py-6 z-10">
        {/* Title */}
        <h1 className="z-20 text-3xl sm:text-5xl font-medium text-white sm:mt-8 mt-4 tracking-tight px-6 py-3 text-center border border-white/20 rounded-lg shadow-lg bg-white/10 backdrop-blur-xl relative overflow-hidden">
          <span className="relative z-10">signup to notesportal</span>
          {/* Static glare overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 60%)",
              }}
            />
          </div>
        </h1>

        {/* Glassmorphism Card */}
        <div
          className="relative w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg p-8 rounded-2xl flex flex-col items-center justify-start overflow-y-auto max-h-[78vh] scrollbar-hide"
          style={{
            marginBottom: "1rem", // lifts up from bottom
            transform: "scale(0.97)", // slightly smaller
          }}
        >
          {/* Static glare overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 60%)",
              }}
            />
          </div>

          {/* Form */}
          <form className="flex flex-col gap-6 w-full relative z-10" action={formAction}>
            {/* Firstname */}
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
                  className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-300 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>
            </div>

            {/* Lastname */}
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
                  className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-300 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>
            </div>

            {/* Username */}
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
                  className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-300 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>
            </div>

            {/* Email */}
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
                  className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-300 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>
            </div>

            {/* Password */}
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
                  className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-300 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                />
              </div>
            </div>

            {/* Confirm Password */}
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
                  className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-300 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                />
              </div>
            </div>

            {/* No. of Subjects */}
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
                  className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-300 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>
            </div>

            {/* Subject Inputs */}
            {Array.from({ length: noOfSubjects }, (_, index) => (
              <div key={index}>
                <label htmlFor={`subject${index}`} className="block mb-1 text-sm text-purple-300">
                  Subject {index + 1}:
                </label>
                <input
                  type="text"
                  name={`subject${index}`}
                  required
                  className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>
            ))}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition"
            >
              Signup
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

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-300 relative z-10">
            Already have an account?{" "}
            <Link href="/login" className="text-purple-400 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
