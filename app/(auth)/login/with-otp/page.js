"use client";
import { useActionState, useState } from "react";
import { login_with_otp } from "@/actions/auth-actions";
import Link from "next/link";
import { FaEnvelope, FaKey } from "react-icons/fa";
import { EmailExists } from "@/actions/other-actions";
import OtpTemplate from "@/lib/email-templates/otp-template-login";
import { generateOtp } from "@/lib/gen-otp";
import Particles from "@/components/effects/particles"; // ✅ import your existing particles component

export default function LoginWithOtpPage() {
  const [formState, formAction] = useActionState(login_with_otp, {});
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(" ");

  async function handleSendOtp(formData) {
    const userEmail = formData.get("email");
    const doesNotExist = await EmailExists(userEmail);
    const otp = generateOtp();
    if (doesNotExist) {
      setEmailError("No account associated with this Email Id");
      setStep(1);
      return;
    }
    setEmailError("");
    setEmail(userEmail);
    setStep(2);
    await fetch("/api/sendOtpMail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: userEmail,
        subject: "OTP FOR LOGIN",
        html: OtpTemplate(otp),
        otp: otp,
      }),
    });
  }

  return (
    <div className="relative bg-black min-h-screen w-full flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* ✅ particles behind everything */}
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

      {/* ✅ content stays above particles */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        <h1 className="text-3xl animate-fade-in-down sm:text-5xl font-bold text-white mb-6 sm:mt-8 mt-4 tracking-tight px-4 py-2 text-center border border-purple-600 rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.5)] bg-gradient-to-tr from-black via-gray-900 to-purple-900">
          Welcome to NotesPortal
        </h1>

        <div className="w-full max-w-5xl flex flex-col items-center justify-center gap-8 px-4 py-6">
          <div className="w-full max-w-lg animate-fade-in-up bg-black/50 backdrop-blur-md border border-purple-700 p-8 rounded-xl shadow-[0_0_25px_rgba(168,85,247,0.2)] flex flex-col items-center justify-center">
            <p className="text-right text-sm text-purple-500 underline underline-offset-4 mb-6">
              <Link href="/login">Login with Password</Link>
            </p>

            {step === 1 && (
              <form
                className="flex flex-col gap-6 w-full"
                action={handleSendOtp}
              >
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
                      name="email"
                      placeholder="Enter your email"
                      required
                      className="w-full bg-[#2b2b30] border border-purple-700 text-white placeholder-gray-400 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  Send OTP
                </button>
                {emailError && <p className="text-red-500">{emailError}</p>}
              </form>
            )}

            {step === 2 && (
              <form className="flex flex-col gap-6 w-full" action={formAction}>
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
                      name="email"
                      value={email}
                      readOnly
                      className="w-full bg-[#2b2b30] border border-purple-700 text-white placeholder-gray-400 rounded-lg px-10 py-2 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="otp"
                    className="block mb-2 text-sm text-purple-300 font-medium"
                  >
                    OTP
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-pink-400">
                      <FaKey />
                    </span>
                    <input
                      type="text"
                      name="otp"
                      placeholder="Enter OTP"
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

                {formState.errors && (
                  <ul className="text-sm text-red-400 mt-2 space-y-1">
                    {formState.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                )}
              </form>
            )}

            <p className="mt-6 text-center text-sm text-gray-300">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-blue-400 hover:underline">
                Signup
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
