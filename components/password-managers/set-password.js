'use client';
import { FiLock } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useActionState, useState } from 'react';
import { EmailExists, setPassword } from "@/actions/other-actions";
import OtpTemplateSetResetPass from "@/lib/email-templates/otp-template-pass";
import { generateOtp } from "@/lib/gen-otp";

export default function SetPasswordModal({ id }) {
  // MODAL STATES
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  // ERROR STATES
  const [emailError, setEmailError] = useState(" ");
  const [otpError, setOtpError] = useState(" ");
  // DATA STATES
  const [otpState, setOtpState] = useState(" ");
  // FORM ACTION STATE
  const [formState, formAction] = useActionState(setPassword, {});

  async function handleSendOtp(formData) {
    const emailId = formData.get('email');
    if (!emailId || emailId.length == 0) {
      setEmailError('please enter a email id');
      setStep(1);
      return;
    }
    const doesNotExist = await EmailExists(emailId);
    if (doesNotExist) {
      setEmailError('no account associated with this email id');
      setStep(1);
      return;
    }
    setEmailError(" ");
    const otp = generateOtp();
    setOtpState(otp);
    setStep(2);
    const res = await fetch('/api/sendOtpMail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: emailId,
        subject: 'OTP FOR SETTING ACCOUNT PASSWORD',
        html: OtpTemplateSetResetPass(otp, 'set'),
        otp: otp
      })
    })
  }

  async function handleVerifyOtp(formData) {
    const otpFromForm = formData.get('otp');
    if (!otpFromForm || otpFromForm.length === 0) {
      setOtpError('Otp not defined');
      setStep(2);
      return;
    }
    if (otpFromForm !== otpState) {
      setOtpError('Invalid Otp, please try again');
      setStep(2);
      return;
    }
    setOtpError(" ");
    setStep(3);
  }
  return (
    <>
      <button onClick={() => { setIsOpen(true); setStep(1); }} className="flex items-center gap-2 bg-[#170b22] border border-purple-500/40 hover:border-purple-400 text-white px-5 py-2.5 rounded-lg transition text-base md:text-lg" type="button">
        <FiLock className="text-xl" /> Set Password
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 backdrop-blur-sm" />
            <motion.div
              className="relative z-10 p-6 rounded-2xl shadow-lg w-full max-w-sm md:max-w-md bg-[#0d0b14] text-white"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-semibold">Set Password</h2>
                <button onClick={() => {setIsOpen(false);setStep(1);setEmailError(" ");setOtpError(" ");setOtpState(" ");}} className="text-sm bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition">
                  Close
                </button>
              </div>

              <div className="flex justify-center mb-6 space-x-4">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold ${step >= s ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                    {s}
                  </div>
                ))}
              </div>

              <p className="mb-1 text-base text-gray-300 text-left">Verify yourself, enter your email id to get the OTP</p>
              <p className="mb-4 text-sm text-gray-400 text-left">Note: It might take some time for the OTP to be sent. Please be patient.</p>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="space-y-4">
                    <form action={handleSendOtp} className="flex flex-col gap-3">
                      <input type="email" name="email" placeholder="Enter email ID" required className="p-3 rounded bg-[#1a1a1f] border border-gray-600 text-base" />
                      <button type="submit" className="bg-purple-600 text-white py-2.5 rounded-lg hover:bg-purple-700 transition text-base">Get OTP</button>
                    </form>
                    {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="space-y-4">
                    <form action={handleVerifyOtp} className="flex flex-col gap-3">
                      <input type="text" name="otp" placeholder="Enter OTP" required className="p-3 rounded-lg bg-[#1a1a1f] border border-gray-600 text-base" />
                      <button type="submit" className="bg-purple-600 text-white py-2.5 rounded hover:bg-purple-700 transition text-base">Submit</button>
                    </form>
                    {otpError && <p className="text-red-500 text-sm">{otpError}</p>}
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="space-y-4">
                    <form action={formAction} className="flex flex-col gap-3">
                      <input type="password" name="p1" placeholder="Enter password" required className="p-3 rounded-lg bg-[#1a1a1f] border border-gray-600 text-base" />
                      <input type="password" name="p2" placeholder="Confirm password" required className="p-3 rounded-lg bg-[#1a1a1f] border border-gray-600 text-base" />
                      <input type="text" name="id" value={id} hidden readOnly />
                      <button type="submit" className="bg-purple-600 text-white py-2.5 rounded hover:bg-purple-700 transition text-base">Set Password</button>

                      {formState.errors && (
                        <ul className="text-sm text-red-400 mt-2 space-y-1">
                          {formState.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      )}
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>

  );
}
