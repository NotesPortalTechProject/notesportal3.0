"use client";
import { signup } from "@/actions/auth-actions";
import Link from "next/link";
import { useActionState, useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaEnvelope, FaKey, FaListOl } from "react-icons/fa";

export default function SignupPage() {
  const [noOfSubjects, setNoOfSubjects] = useState(0);
  const [formState, formAction] = useActionState(signup, {});

  function handleSubjectsChange(event) {
    const value = parseInt(event.target.value, 10);
    setNoOfSubjects(isNaN(value) ? 0 : value);
  }

  return (
    <div className="bg-black max-h-screen w-full flex flex-col items-center justify-start px-4 overflow-y-auto scrollbar-hide">
      <div className="absolute inset-0 animate-pulse opacity-5 text-6xl pointer-events-none select-none">
        <div className="absolute top-[10%] left-[15%]">📄</div>
        <div className="absolute top-[40%] right-[20%]">📝</div>
        <div className="absolute bottom-[20%] left-[30%]">📚</div>
      </div>

      <h1 className="text-3xl animate-fade-in-down sm:text-5xl font-bold text-white mb-6 sm:mt-8 mt-4 tracking-tight px-4 py-2 text-center border border-purple-600 rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.5)] bg-gradient-to-tr from-black via-gray-900 to-purple-900">
        Signup to NotesPortal
      </h1>

      <div className="w-full max-w-5xl flex flex-col items-center justify-center gap-8 px-4 py-6">
        <div className="w-full max-w-lg animate-fade-in-up bg-black/50 backdrop-blur-md border border-purple-700 p-8 rounded-xl shadow-[0_0_25px_rgba(168,85,247,0.2)] flex flex-col items-center justify-start overflow-y-auto max-h-[80vh] scrollbar-hide">
          <form className="flex flex-col gap-6 w-full" action={formAction}>
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm text-purple-300 font-medium"
              >
                Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-purple-400">
                  <FaUser />
                </span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full bg-[#2b2b30] border border-purple-700 text-white placeholder-gray-400 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

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
                  id="username"
                  name="username"
                  required
                  className="w-full bg-[#2b2b30] border border-purple-700 text-white placeholder-gray-400 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm text-purple-300 font-medium"
              >
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
                  id="password"
                  name="password"
                  required
                  className="w-full bg-[#2b2b30] border border-purple-700 text-white placeholder-gray-400 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm_password"
                className="block mb-2 text-sm text-purple-300 font-medium"
              >
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-pink-400">
                  <FaKey />
                </span>
                <input
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  required
                  className="w-full bg-[#2b2b30] border border-purple-700 text-white placeholder-gray-400 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="no_of_subjects"
                className="block mb-2 text-sm text-purple-300 font-medium"
              >
                Number of Subjects
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-purple-400">
                  <FaListOl />
                </span>
                <input
                  type="number"
                  id="no_of_subjects"
                  name="no_of_subjects"
                  value={noOfSubjects}
                  onChange={handleSubjectsChange}
                  required
                  className="w-full bg-[#2b2b30] border border-purple-700 text-white placeholder-gray-400 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
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
                  className="w-full bg-[#1c1c2c] border border-white/10 text-white placeholder-white/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a78bfa] focus:border-transparent transition"
                />
              </div>
            ))}

            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              Signup
            </button>

            {formState.errors && (
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
            <Link
              href="/4eae3ce9-a2ff-45c1-8a13-3f5bc9eddfb3/home"
              className="text-blue-400 hover:underline"
            >
              Test route
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
