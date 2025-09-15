'use client';
import { FiLock } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useActionState, useState } from 'react';
import { EmailExists, setPassword } from "@/actions/other-actions";
import OtpTemplateSetResetPass from "@/lib/email-templates/otp-template-pass";
import { generateOtp } from "@/lib/gen-otp";

export default function ResetPasswordModal({ id }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [emailError, setEmailError] = useState(" ");
  const [otpError, setOtpError] = useState(" ");
  const [otpState, setOtpState] = useState(" ");
  const [formState, formAction] = useActionState(setPassword, {});

  async function handleSendOtp(formData) {
    const emailId = formData.get('email');
    if (!emailId || emailId.length === 0) {
      setEmailError('Please enter an email');
      setStep(1);
      return;
    }

    const doesNotExist = await EmailExists(emailId);
    if (doesNotExist) {
      setEmailError('No account associated with this email');
      setStep(1);
      return;
    }

    setEmailError(" ");
    const otp = generateOtp();
    setOtpState(otp);
    setStep(2);

    await fetch('/api/sendOtpMail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: emailId,
        subject: 'OTP FOR RESETTING ACCOUNT PASSWORD',
        html: OtpTemplateSetResetPass(otp, 'reset'),
        otp: otp
      })
    });
    console.log(res)
  }

  async function handleVerifyOtp(formData) {
    const otpFromForm = formData.get('otp');
    if (!otpFromForm || otpFromForm.length === 0) {
      setOtpError('OTP is required');
      setStep(2);
      return;
    }

    if (otpFromForm !== otpState) {
      setOtpError('Invalid OTP, please try again');
      setStep(2);
      return;
    }

    setOtpError(" ");
    setStep(3);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-600 transition text-white flex items-center gap-2"
        type="button"
      >
        <FiLock className="text-lg" /> Reset Password
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 backdrop-blur-sm bg-black/30"
              onClick={() => {
                setIsOpen(false);
                setStep(1);
                setEmailError(" ");
                setOtpError(" ");
                setOtpState(" ");
              }}
            />

            <motion.div
              className="relative z-10 w-full max-w-md p-6 rounded-2xl backdrop-blur-2xl bg-gradient-to-br from-[#1a1a1a]/90 via-[#2a1a3d]/70 to-[#3d1f5e]/60 border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.15)] text-white"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-purple-300">Reset Password</h2>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setStep(1);
                    setEmailError(" ");
                    setOtpError(" ");
                    setOtpState(" ");
                  }}
                  className="text-sm font-medium bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                >
                  Close
                </button>
              </div>

              {/* Step Indicators */}
              <div className="flex justify-center gap-6 mb-4">
                {[1, 2, 3].map((s, i) => (
                  <motion.div
                    key={i}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${step >= s
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-600 text-white/70'
                      }`}
                    animate={{ scale: step === s ? 1.2 : 1 }}
                  >
                    {s}
                  </motion.div>
                ))}
              </div>

              <p className="text-sm text-white/60 mb-4 text-center">
                Use the same OTP throughout the process.
              </p>

              {/* Step 1: Email */}
              {step === 1 && (
                <form action={handleSendOtp} className="space-y-4">
                  <div className="flex flex-col text-left">
                    <label className="mb-1 text-sm">Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      required
                      className="bg-white/5 border border-purple-500/10 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition"
                  >
                    Get OTP
                  </button>
                  {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                </form>
              )}

              {/* Step 2: OTP */}
              {step === 2 && (
                <form action={handleVerifyOtp} className="space-y-4">
                  <div className="flex flex-col text-left">
                    <label className="mb-1 text-sm">OTP</label>
                    <input
                      type="text"
                      name="otp"
                      placeholder="Enter OTP"
                      required
                      className="bg-white/5 border border-purple-500/10 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition"
                  >
                    Submit OTP
                  </button>
                  {otpError && <p className="text-red-500 text-sm">{otpError}</p>}
                </form>
              )}

              {/* Step 3: Set Password */}
              {step === 3 && (
                <form action={formAction} className="space-y-4">
                  <div className="flex flex-col text-left">
                    <label className="mb-1 text-sm">New Password</label>
                    <input
                      type="password"
                      name="p1"
                      placeholder="Enter password"
                      required
                      className="bg-white/5 border border-purple-500/10 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <label className="mb-1 text-sm">Confirm Password</label>
                    <input
                      type="password"
                      name="p2"
                      placeholder="Confirm password"
                      required
                      className="bg-white/5 border border-purple-500/10 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <input type="text" name="id" value={id} hidden readOnly />
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg transition"
                  >
                    Reset Password
                  </button>
                  {formState?.errors && (
                    <ul className="text-sm text-red-400 mt-2 space-y-1">
                      {formState.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  )}
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
