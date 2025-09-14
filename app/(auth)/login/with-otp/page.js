"use client";
import { useActionState, useState } from "react";
import { login_with_otp } from "@/actions/auth-actions";
import Link from "next/link";
import { FaEnvelope, FaKey } from "react-icons/fa";
import { EmailExists } from "@/actions/other-actions";
import OtpTemplate from "@/lib/email-templates/otp-template-login";
import { generateOtp } from "@/lib/gen-otp";
import Particles from "@/components/effects/particles";
import LoadingDots from "@/components/loadingDots";

export default function LoginWithOtpPage() {
  const [formState, formAction] = useActionState(login_with_otp, {});
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(" ");
  const [loading,setLoading] = useState(false);

  async function handleSendOtp(formData) {
    try {
      setLoading(true)
      const userEmail = formData.get("email");
      const doesNotExist = await EmailExists(userEmail);
      const otp = generateOtp();
      console.log(userEmail)
      console.log(otp)
      if (doesNotExist) {
        setEmailError("No account associated with this Email Id");
        setLoading(false);
        setStep(1);
        return;
      }
      setEmailError("");
      setEmail(userEmail);
      const res = await fetch(`/api/sendOtpMail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: userEmail,
          subject: "OTP FOR LOGIN",
          html: OtpTemplate(otp),
          otp: otp,
        }),
      });
      const data = await res.json();
      setLoading(false)
      if (!res.ok || !data.success) {
        setEmailError("Failed to send OTP please try again", data.message);
        setLoading(false);
        setStep(1);
        return;
      }
      setEmailError("");
      setStep(2);
    } catch (error) {
      setEmailError("Something went wrong while sending OTP. Please try again.");
      setLoading(false);
      setStep(1);
    }
  }

  return (
    <div className="relative bg-black min-h-screen w-full flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleCount={300}
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

      {/* Heading */}
      <h1 className="text-3xl animate-fade-in-down sm:text-5xl font-medium text-white mb-6 sm:mt-8 mt-4 tracking-tight px-4 py-2 text-center border border-purple-600 rounded-lg shadow-sm bg-black/90">
        welcome to notesportal
      </h1>

      {/* Main Container */}
      <div className="w-full max-w-5xl flex flex-col items-center justify-center gap-8 px-4 py-6 relative z-10">
        {/* Form Card */}
        <div className="w-full max-w-lg animate-fade-in-up bg-black/80 backdrop-blur-md border border-purple-500/30 p-8 rounded-xl shadow-sm flex flex-col items-center justify-center">
          <p className="text-right text-sm text-purple-500 underline underline-offset-4 mb-6">
            <Link href="/login">Login with Password</Link>
          </p>

          {step === 1 && (
            <form className="flex flex-col gap-6 w-full" action={handleSendOtp}>
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
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
              >
                {loading ? <LoadingDots text="please wait"/>:"Send OTP"}
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
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
              >
                Submit
              </button>

              {formState?.errors?.length > 0 && (
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
  );
}
