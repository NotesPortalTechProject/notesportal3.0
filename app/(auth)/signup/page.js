"use client";
import { signup } from "@/actions/auth-actions";
import { sendOtpAction, verifyOtpAction } from "@/actions/otp-action";
import { motion, AnimatePresence } from "framer-motion";
import { useActionState, useEffect, useState } from "react";
import Particles from "@/components/effects/particles";
import LoadingDots from "@/components/loadingDots";
import {
  FaUser,
  FaEnvelope,
  FaKey,
  FaCheckCircle,
  FaExclamationCircle,
  FaLock,
  FaListOl,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import Link from "next/link";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [formState, formAction, isPending] = useActionState(signup, {});

  // STEP 1 - PERSONAL
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [pdError, setPdError] = useState("");

  // STEP 2 - VERIFICATION
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpHash, setOtpHash] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  // STEP 3 - SECURITY
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [passError, setPassError] = useState("");

  // STEP 4 - ACADEMICS
  const [noOfSubjects, setNoOfSubjects] = useState(0);
  const [subjects, setSubjects] = useState({});

  // Error Navigation Effect
  useEffect(() => {
    if (formState?.errors && formState.errors.length > 0) {
      const errorString = formState.errors.join(" ").toLowerCase();
      if (
        errorString.includes("first name") ||
        errorString.includes("last name") ||
        errorString.includes("username")
      ) {
        setStep(1);
        return;
      }
      if (errorString.includes("email")) {
        setStep(2);
        return;
      }
      if (errorString.includes("password") || errorString.includes("match")) {
        setStep(3);
        return;
      }
      if (errorString.includes("subject") || errorString.includes("provided")) {
        setStep(4);
        return;
      }
    }
  }, [formState]);

  // HANDLERS
  async function handleSubjectsChange(event) {
    const value = parseInt(event.target.value, 10);
    setNoOfSubjects(isNaN(value) ? 0 : value);
  }

  function handleSubjectNameChange(index, value) {
    setSubjects((prev) => ({ ...prev, [`subject${index}`]: value }));
  }

  async function handleNextStep() {
    if (step === 1) {
      if (!firstname || !lastname || !username) {
        setPdError("All fields are required");
        return;
      }
      setPdError("");
      setStep(2);
    } else if (step === 2) {
      if (!isEmailVerified) {
        setOtpError("Please verify your email to proceed");
        return;
      }
      setOtpError("");
      setStep(3);
    } else if (step === 3) {
      if (!password || !confirmpassword) {
        setPassError("Fields cannot be empty");
        return;
      }
      if (password !== confirmpassword) {
        setPassError("Passwords do not match");
        return;
      }
      if (password.length < 7) {
        setPassError("Password must be at least 7 characters long");
        return;
      }
      setPassError("");
      setStep(4);
    }
  }

  function handlePrevStep() {
    if (step > 1) setStep(step - 1);
  }

  async function sendOtp() {
    if (!email || !email.includes("@")) {
      setOtpError("Please enter a valid email");
      return;
    }
    setEmailLoading(true);
    setOtpError("");

    try {
      const result = await sendOtpAction(email,"signupAccVerification");
      if (result.success) {
        setOtpHash(result.hash);
        setOtpSent(true);
      } else {
        setOtpError(result.error);
      }
    } catch (error) {
      console.error(error);
      setOtpError("Failed to send Otp");
    } finally {
      setEmailLoading(false);
    }
  }

  async function verifyOtp() {
    if (!otp) {
      setOtpError("Please enter OTP");
      return;
    }
    setVerifyLoading(true);
    setOtpError("");

    try {
      const result = await verifyOtpAction(otp, otpHash);
      if (result.success) {
        setIsEmailVerified(true);
        setOtpError("");
      } else {
        setOtpError(result.error || "Invalid OTP");
      }
    } catch (error) {
      setOtpError("Verification failed");
    } finally {
      setVerifyLoading(false);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (step < 4) {
        e.preventDefault();
        handleNextStep();
      }
    }
  };

  // ANIMATION
  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 20 : -20, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 20 : -20, opacity: 0 }),
  };

  // STYLES
  const inputStyle = "w-full bg-[#1a1a1a]/70 border border-purple-500/20 text-white placeholder-purple-300/50 rounded-lg px-9 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 transition shadow-inner";
  const labelStyle = "block mb-1 text-xs text-purple-300 font-medium ml-1";
  const primaryBtnStyle = "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-5 py-2 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_#9333ea40] text-sm font-semibold hover:scale-[1.02] active:scale-[0.98]";

  return (
    <div className="relative bg-black min-h-screen w-full flex flex-col items-center justify-center overflow-hidden p-4">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleCount={200}
          particleSpread={15}
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

      {/* Main Content */}
      <div className="z-20 w-full max-w-[440px] flex flex-col items-center">
        
        {/* Header - Glass Style */}
        <h1 className="text-2xl sm:text-4xl font-medium text-white mb-6 tracking-tight px-8 py-3 text-center rounded-2xl shadow-[0_0_15px_rgba(168,85,247,0.3)] bg-gradient-to-br from-[#1a1a1a]/40 to-[#2a1a3d]/40 border border-purple-500/30 backdrop-blur-md">
          signup to notesportal
        </h1>

        {/* Card Container - Glass Style */}
        <div className="w-full p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#1a1a1a]/20 to-[#2a1a3d]/20 backdrop-blur-md border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.15)] flex flex-col items-center">
          
          {/* Progress Steps */}
          <div className="flex justify-center gap-3 mb-6 w-full">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex flex-col items-center gap-1">
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    step >= s
                      ? "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)] scale-110"
                      : "bg-purple-900/40"
                  }`}
                />
              </div>
            ))}
          </div>

          <form
            action={formAction}
            onKeyDown={handleKeyDown}
            className="w-full flex flex-col"
          >
            <input type="hidden" name="firstname" value={firstname} readOnly />
            <input type="hidden" name="lastname" value={lastname} readOnly />
            <input type="hidden" name="username" value={username} readOnly />
            <input type="hidden" name="email" value={email} readOnly />
            <input type="hidden" name="password" value={password} readOnly />
            <input type="hidden" name="confirmpassword" value={confirmpassword} readOnly />
            <input type="hidden" name="nsubjects" value={noOfSubjects} readOnly />
            {Array.from({ length: noOfSubjects }).map((_, index) => (
              <input key={index} type="hidden" name={`subject${index}`} value={subjects[`subject${index}`] || ""} />
            ))}

            <div className="w-full">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <label className={labelStyle}>First Name</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-purple-400 text-sm"><FaUser /></span>
                        <input type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} className={inputStyle} placeholder="First name" autoFocus required />
                      </div>
                    </div>
                    <div>
                      <label className={labelStyle}>Last Name</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-purple-400 text-sm"><FaUser /></span>
                        <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} className={inputStyle} placeholder="Last name" required />
                      </div>
                    </div>
                    <div>
                      <label className={labelStyle}>Username</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-purple-400 text-sm"><FaUser /></span>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={inputStyle} placeholder="Username" required />
                      </div>
                    </div>
                    {pdError && <p className="text-red-400 text-xs flex items-center gap-1 mt-1 animate-pulse"><FaExclamationCircle /> {pdError}</p>}
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <label className={labelStyle}>Email Address</label>
                      <div className="relative flex gap-2">
                        <div className="relative flex-grow">
                          <span className="absolute inset-y-0 left-3 flex items-center text-purple-400 text-sm"><FaEnvelope /></span>
                          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={otpSent || isEmailVerified} className={`${inputStyle} disabled:opacity-50`} placeholder="name@example.com" autoFocus />
                        </div>
                        {!otpSent && !isEmailVerified && (
                          <button type="button" onClick={sendOtp} disabled={emailLoading} className={`${primaryBtnStyle} px-3 py-0 text-xs whitespace-nowrap`}>
                            {emailLoading ? <LoadingDots /> : "Send OTP"}
                          </button>
                        )}
                      </div>
                    </div>

                    {otpSent && !isEmailVerified && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
                        <label className={labelStyle}>Verification Code</label>
                        <div className="relative flex gap-2">
                          <div className="relative flex-grow">
                            <span className="absolute inset-y-0 left-3 flex items-center text-purple-400 text-sm"><FaKey /></span>
                            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className={inputStyle} placeholder="Enter 6-digit code" />
                          </div>
                          <button type="button" onClick={verifyOtp} disabled={verifyLoading} className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-lg text-xs font-medium shadow-lg transition-colors">
                            {verifyLoading ? <LoadingDots /> : "Verify"}
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {isEmailVerified && (
                      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center justify-center gap-2 text-green-300 text-sm">
                        <FaCheckCircle /> <span>Email Verified</span>
                      </motion.div>
                    )}
                    
                    {otpError && <p className="text-red-400 text-xs flex items-center gap-1 mt-1 "><FaExclamationCircle /> {otpError}</p>}
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <label className={labelStyle}>Password</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-purple-400 text-sm"><FaLock /></span>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputStyle} placeholder="Create password" autoFocus />
                      </div>
                    </div>
                    <div>
                      <label className={labelStyle}>Confirm Password</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-purple-400 text-sm"><FaKey /></span>
                        <input type="password" value={confirmpassword} onChange={(e) => setConfirmpassword(e.target.value)} className={inputStyle} placeholder="Confirm password" />
                      </div>
                    </div>
                    {passError && <p className="text-red-400 text-xs flex items-center gap-1 mt-1 animate-pulse"><FaExclamationCircle /> {passError}</p>}
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-4 w-full"
                  >
                    <div>
                      <label className={labelStyle}>Number of Subjects</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-purple-400 text-sm"><FaListOl /></span>
                        <input type="number" value={noOfSubjects} onChange={handleSubjectsChange} min="0" max="15" className={inputStyle} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent pr-1">
                      {Array.from({ length: noOfSubjects }, (_, index) => (
                        <motion.input
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          type="text"
                          value={subjects[`subject${index}`] || ""}
                          onChange={(e) => handleSubjectNameChange(index, e.target.value)}
                          placeholder={`Subject ${index + 1}`}
                          className="w-full bg-[#1a1a1a]/50 border border-purple-500/20 text-white placeholder-purple-400/30 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 focus:bg-[#1a1a1a]"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ERROR MSG DIV */}
            {formState?.errors?.length > 0 && (
              <div className="mt-3 w-full p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-xs text-red-300 text-center flex items-center justify-center gap-1">
                  <FaExclamationCircle /> {formState.errors[0]}
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6 w-full pt-2 border-t border-purple-500/10">
              <div className="w-24">
                {step > 1 && (
                  <button type="button" onClick={handlePrevStep} className="flex items-center gap-2 text-purple-400/70 hover:text-purple-300 transition text-xs font-medium px-2 py-1 rounded hover:bg-white/5">
                    <FaArrowLeft /> Back
                  </button>
                )}
              </div>
              
              <div className="w-full flex justify-end">
                {step < 4 ? (
                  <button 
                    key="next-btn"
                    type="button" 
                    onClick={handleNextStep} 
                    className={primaryBtnStyle}
                  >
                    Next <FaArrowRight className="text-xs" />
                  </button>
                ) : (
                  <button 
                    key="submit-btn"
                    type="submit" 
                    disabled={isPending} 
                    className={primaryBtnStyle}
                  >
                    {isPending ? <LoadingDots text="Creating" /> : "Sign Up"}
                  </button>
                )}
              </div>
            </div>

          </form>

          <div className="mt-4 w-full text-center">
             <p className="text-xs text-purple-300/60">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                Log in
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}