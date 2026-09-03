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
  FaArrowLeft,
  FaArrowRight,
  FaList,
  FaPlus,
  FaSearch,
  FaTimes
} from "react-icons/fa";
import Link from "next/link";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [formState, formAction, isPending] = useActionState(signup, {});

  // PERSONAL
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [pdError, setPdError] = useState("");

  // VERIFICATION
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpHash, setOtpHash] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  // SECURITY
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [passError, setPassError] = useState("");

  // SUBJECTS
  const [subjects, setSubjects] = useState({});
  const [subjectCode, setSubjectCode] = useState("");
  const [concept, setConcept] = useState("");
  const [subjectSuggestions, setSubjectSuggestions] = useState([]);
  const [subjectError, setSubjectError] = useState("");
  const [subjectSearchError, setSubjectSearchError] = useState("");
  const [isSearchingSubjects, setIsSearchingSubjects] = useState(false);

  const subjectCount = Object.keys(subjects).length;

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

      if (password.length < 8) {
        setPassError("Password must be at least 8 characters long");
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
      const result = await sendOtpAction(email, "signupAccVerification");

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

  // SUBJECT WORKING FNS
  function addSubject(codeInput = subjectCode) {
    const code = codeInput.trim().toUpperCase();

    if (!code) {
      setSubjectError("Please enter a subject code");
      return;
    }

    if (code.length < 2) {
      setSubjectError("Subject code must have at least 2 characters");
      return;
    }

    if (code.length > 10) {
      setSubjectError("Subject code cannot be greater than 10 characters");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(code)) {
      setSubjectError("Subject code cannot contain special characters");
      return;
    }

    const alreadyexists = Object.values(subjects).some(
      (i) => i?.toUpperCase() === code
    );

    if (alreadyexists) {
      setSubjectError("Subject already added");
      return;
    }

    setSubjects((prev) => {
      const index = Object.keys(prev).length;

      return {
        ...prev,
        [`subject${index}`]: code,
      };
    });

    setSubjectCode("");
    setSubjectError("");
  }

  function removeSubject(index) {
    setSubjects((prev) => {
      const updated = { ...prev };

      delete updated[`subject${index}`];

      const reindexed = {};

      Object.values(updated).forEach((subject, i) => {
        reindexed[`subject${i}`] = subject;
      });

      return reindexed;
    });
  }

  async function findSubjects() {
    try {
      const searchTerm = concept.trim();
      if (!searchTerm) {
        setSubjectSearchError("Please describe the subject first");
        return;
      }
      setSubjectSearchError("");
      setSubjectSuggestions([]);
      setIsSearchingSubjects(true);
      const response = await fetch("/api/smartsearchsubject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchTerm),
      });
      console.log("API STATUS:", response.status);
      const text = await response.text();
      if (!response.ok) {
        throw new Error(
          `API failed with status ${response.status}: ${text}`
        );
      }
      let result;
      try {
        result = JSON.parse(text);
      } catch (parseError) {
        throw new Error("Server returned an invalid JSON response");
      }
      setSubjectSuggestions(result);
    } catch (error) {
      setSubjectSearchError(
        error.message || "Unable to find matching subjects"
      );
    } finally {
      setIsSearchingSubjects(false);
    }
  }

  // ANIMATION
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 20 : -20,
      opacity: 0,
    }),
  };

  // UI STYLES ONLY
  const inputStyle =
    "w-full h-12 bg-[#111111]/80 border border-purple-500/20 text-white placeholder-purple-300/40 rounded-xl pl-11 pr-4 text-sm sm:text-base focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 transition-all shadow-inner";

  const labelStyle =
    "block mb-2 text-sm text-purple-200 font-medium ml-1";

  const helperStyle =
    "text-xs text-purple-300/50 ml-1 mb-3";

  const primaryBtnStyle =
    "min-h-11 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_18px_#9333ea35] text-sm font-semibold hover:scale-[1.015] active:scale-[0.98]";

  const secondaryBtnStyle =
    "min-h-11 px-5 rounded-xl border border-purple-500/15 bg-white/[0.03] text-purple-300/80 hover:text-white hover:bg-white/[0.06] transition-all text-sm font-medium";

  return (
    <div className="relative bg-black min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 py-8 sm:px-6">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleCount={200}
          particleSpread={15}
          speed={0.15}
          particleColors={[
            "#a855f7",
            "#8b5cf6",
            "#c084fc",
            "#f5d0fe",
          ]}
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
      <div className="relative z-20 w-full max-w-4xl flex flex-col items-center">

        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="inline-block text-2xl sm:text-3xl lg:text-4xl font-medium text-white tracking-tight px-6 sm:px-8 py-3 rounded-2xl shadow-[0_0_25px_rgba(168,85,247,0.25)] bg-gradient-to-br from-[#1a1a1a]/50 to-[#2a1a3d]/50 border border-purple-500/25 backdrop-blur-xl">
            signup to notesportal
          </h1>

          <p className="text-xs sm:text-sm text-purple-300/45 mt-3">
            Create your account in a few simple steps
          </p>
        </div>

        {/* Main Card */}
        <div className="w-full rounded-3xl bg-gradient-to-br from-[#151515]/70 to-[#241533]/55 backdrop-blur-xl border border-purple-500/15 shadow-[0_0_60px_rgba(168,85,247,0.12)] overflow-hidden">

          {/* Progress Header */}
          <div className="px-5 sm:px-10 lg:px-14 pt-7 sm:pt-9">

            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {[1, 2, 3, 4].map((s) => {
                const labels = [
                  "Personal",
                  "Email",
                  "Password",
                  "Subjects",
                ];

                return (
                  <div
                    key={s}
                    className="flex items-center flex-1 last:flex-none"
                  >
                    <div className="flex flex-col items-center min-w-[58px] sm:min-w-[80px]">

                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-300 border ${step >= s
                          ? "bg-purple-600 border-purple-400/60 text-white shadow-[0_0_18px_rgba(168,85,247,0.45)]"
                          : "bg-[#111]/80 border-purple-500/15 text-purple-300/35"
                          }`}
                      >
                        {s}
                      </div>

                      <span
                        className={`mt-2 text-[10px] sm:text-xs whitespace-nowrap transition-colors ${step >= s
                          ? "text-purple-200"
                          : "text-purple-300/30"
                          }`}
                      >
                        {labels[s - 1]}
                      </span>
                    </div>

                    {s < 4 && (
                      <div
                        className={`h-px flex-1 mx-2 sm:mx-4 mt-[-18px] transition-all duration-500 ${step > s
                          ? "bg-purple-500/60"
                          : "bg-purple-500/10"
                          }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Area */}
          <div className="px-5 sm:px-10 lg:px-14 py-8 sm:py-10">

            <form
              action={formAction}
              onKeyDown={handleKeyDown}
              className="w-full flex flex-col"
            >

              {/* Hidden Values */}
              <input
                type="hidden"
                name="firstname"
                value={firstname}
                readOnly
              />

              <input
                type="hidden"
                name="lastname"
                value={lastname}
                readOnly
              />

              <input
                type="hidden"
                name="username"
                value={username}
                readOnly
              />

              <input
                type="hidden"
                name="email"
                value={email}
                readOnly
              />

              <input
                type="hidden"
                name="password"
                value={password}
                readOnly
              />

              <input
                type="hidden"
                name="confirmpassword"
                value={confirmpassword}
                readOnly
              />

              <input
                type="hidden"
                name="nsubjects"
                value={subjectCount}
              />

              {Object.entries(subjects).map(([key, subject]) => (
                <input
                  key={key}
                  type="hidden"
                  name={key}
                  value={subject}
                  readOnly
                />
              ))}

              <div className="w-full min-h-[300px]">
                <AnimatePresence mode="wait">

                  {/* STEP 1 */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                      className="w-full max-w-2xl mx-auto"
                    >
                      <div className="mb-7">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white">
                          Tell us about yourself
                        </h2>

                        <p className="text-sm text-purple-300/45 mt-1.5">
                          Enter your basic details to get started.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                        <div>
                          <label className={labelStyle}>
                            First Name
                          </label>

                          <div className="relative">
                            <span className="absolute inset-y-0 left-4 flex items-center text-purple-400 text-sm">
                              <FaUser />
                            </span>

                            <input
                              type="text"
                              value={firstname}
                              onChange={(e) =>
                                setFirstname(e.target.value)
                              }
                              className={inputStyle}
                              placeholder="First name"
                              autoFocus
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelStyle}>
                            Last Name
                          </label>

                          <div className="relative">
                            <span className="absolute inset-y-0 left-4 flex items-center text-purple-400 text-sm">
                              <FaUser />
                            </span>

                            <input
                              type="text"
                              value={lastname}
                              onChange={(e) =>
                                setLastname(e.target.value)
                              }
                              className={inputStyle}
                              placeholder="Last name"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label className={labelStyle}>
                            Username
                          </label>

                          <div className="relative">
                            <span className="absolute inset-y-0 left-4 flex items-center text-purple-400 text-sm">
                              <FaUser />
                            </span>

                            <input
                              type="text"
                              value={username}
                              onChange={(e) =>
                                setUsername(e.target.value)
                              }
                              className={inputStyle}
                              placeholder="Choose a username"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {pdError && (
                        <p className="text-red-400 text-sm flex items-center gap-2 mt-4">
                          <FaExclamationCircle />
                          {pdError}
                        </p>
                      )}
                    </motion.div>
                  )}

                  {/* STEP 2 */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                      className="w-full max-w-2xl mx-auto"
                    >
                      <div className="mb-7">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white">
                          Verify your email
                        </h2>

                        <p className="text-sm text-purple-300/45 mt-1.5">
                          We’ll send a verification code to your email
                          address.
                        </p>
                      </div>

                      <div>
                        <label className={labelStyle}>
                          Email Address
                        </label>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="relative flex-1">
                            <span className="absolute inset-y-0 left-4 flex items-center text-purple-400 text-sm">
                              <FaEnvelope />
                            </span>

                            <input
                              type="email"
                              value={email}
                              onChange={(e) =>
                                setEmail(e.target.value)
                              }
                              disabled={otpSent || isEmailVerified}
                              className={`${inputStyle} disabled:opacity-40`}
                              placeholder="name@example.com"
                              autoFocus
                            />
                          </div>

                          {!otpSent && !isEmailVerified && (
                            <button
                              type="button"
                              onClick={sendOtp}
                              disabled={emailLoading}
                              className={`${primaryBtnStyle} sm:px-6 whitespace-nowrap`}
                            >
                              {emailLoading ? (
                                <LoadingDots />
                              ) : (
                                "Send OTP"
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {otpSent && !isEmailVerified && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            height: 0,
                          }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                          }}
                          className="overflow-hidden mt-6"
                        >
                          <label className={labelStyle}>
                            Verification Code
                          </label>

                          <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                              <span className="absolute inset-y-0 left-4 flex items-center text-purple-400 text-sm">
                                <FaKey />
                              </span>

                              <input
                                type="text"
                                value={otp}
                                onChange={(e) =>
                                  setOtp(e.target.value)
                                }
                                className={inputStyle}
                                placeholder="Enter 6-digit code"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={verifyOtp}
                              disabled={verifyLoading}
                              className="min-h-12 bg-green-600 hover:bg-green-700 text-white px-7 rounded-xl text-sm font-semibold shadow-lg transition-all"
                            >
                              {verifyLoading ? (
                                <LoadingDots />
                              ) : (
                                "Verify"
                              )}
                            </button>
                          </div>

                          <p className="text-xs text-purple-300/35 mt-3 ml-1">
                            Check your inbox for the verification code.
                          </p>
                        </motion.div>
                      )}

                      {isEmailVerified && (
                        <motion.div
                          initial={{
                            scale: 0.97,
                            opacity: 0,
                          }}
                          animate={{
                            scale: 1,
                            opacity: 1,
                          }}
                          className="mt-6 p-4 bg-green-500/10 border border-green-500/25 rounded-xl flex items-center justify-center gap-2 text-green-300 text-sm"
                        >
                          <FaCheckCircle />
                          <span>Email Verified</span>
                        </motion.div>
                      )}

                      {otpError && (
                        <p className="text-red-400 text-sm flex items-center gap-2 mt-4">
                          <FaExclamationCircle />
                          {otpError}
                        </p>
                      )}
                    </motion.div>
                  )}

                  {/* STEP 3 */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                      className="w-full max-w-2xl mx-auto"
                    >
                      <div className="mb-7">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white">
                          Secure your account
                        </h2>

                        <p className="text-sm text-purple-300/45 mt-1.5">
                          Create a strong password for your NotesPortal
                          account.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                        <div>
                          <label className={labelStyle}>
                            Password
                          </label>

                          <div className="relative">
                            <span className="absolute inset-y-0 left-4 flex items-center text-purple-400 text-sm">
                              <FaLock />
                            </span>

                            <input
                              type="password"
                              value={password}
                              onChange={(e) =>
                                setPassword(e.target.value)
                              }
                              className={inputStyle}
                              placeholder="Create password"
                              autoFocus
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelStyle}>
                            Confirm Password
                          </label>

                          <div className="relative">
                            <span className="absolute inset-y-0 left-4 flex items-center text-purple-400 text-sm">
                              <FaKey />
                            </span>

                            <input
                              type="password"
                              value={confirmpassword}
                              onChange={(e) =>
                                setConfirmpassword(e.target.value)
                              }
                              className={inputStyle}
                              placeholder="Confirm password"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 p-4 rounded-xl bg-purple-500/[0.04] border border-purple-500/10">
                        <p className="text-xs text-purple-300/50">
                          Your password must contain at least 8
                          characters.
                        </p>
                      </div>

                      {passError && (
                        <p className="text-red-400 text-sm flex items-center gap-2 mt-4">
                          <FaExclamationCircle />
                          {passError}
                        </p>
                      )}
                    </motion.div>
                  )}

                  {/* STEP 4 */}
                  {step === 4 && (
                    <motion.div
                      key="step4"
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                      className="w-full"
                    >
                      <div className="mb-8">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white">
                          Add your subjects
                        </h2>

                        <p className="text-sm text-purple-300/45 mt-1.5">
                          Add subject codes from your timetable, or
                          find a code using a short description.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-7">

                        {/* LEFT */}
                        <div className="flex flex-col gap-6">

                          {/* Direct Code */}
                          <div className="rounded-2xl bg-black/20 border border-purple-500/10 p-5 sm:p-6">
                            <div className="mb-4">
                              <label className={labelStyle}>
                                Subject Code
                              </label>

                              <p className="text-xs text-purple-300/45 ml-1">
                                Enter the code directly from your
                                timetable.
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                              <div className="relative flex-1">
                                <span className="absolute inset-y-0 left-4 flex items-center text-purple-400 text-sm">
                                  <FaList />
                                </span>

                                <input
                                  type="text"
                                  value={subjectCode}
                                  onChange={(e) => {
                                    setSubjectCode(e.target.value);
                                    setSubjectError("");
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      addSubject(subjectCode);
                                    }
                                  }}
                                  className={inputStyle}
                                  placeholder="e.g. DBMS"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={()=>{
                                  addSubject(subjectCode)
                                }}
                                className={`${primaryBtnStyle} sm:px-6 whitespace-nowrap`}
                              >
                                <FaPlus className="text-xs" />
                                Add Subject
                              </button>
                            </div>

                            {subjectError && (
                              <p className="text-red-400 text-xs mt-3 ml-1">
                                {subjectError}
                              </p>
                            )}
                          </div>

                          {/* Divider */}
                          <div className="flex items-center gap-4">
                            <div className="h-px bg-purple-500/10 flex-1" />

                            <span className="text-xs font-medium text-purple-300/30">
                              OR
                            </span>

                            <div className="h-px bg-purple-500/10 flex-1" />
                          </div>

                          {/* Search */}
                          <div className="rounded-2xl bg-black/20 border border-purple-500/10 p-5 sm:p-6">
                            <div className="mb-4">
                              <label className={labelStyle}>
                                Find Subject Code
                              </label>

                              <p className="text-xs text-purple-300/45 ml-1">
                                Describe the subject in a few words
                                and we’ll find matching codes.
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                              <div className="relative flex-1">
                                <span className="absolute inset-y-0 left-4 flex items-center text-purple-400 text-sm">
                                  <FaSearch />
                                </span>

                                <input
                                  type="text"
                                  value={concept}
                                  onChange={(e) => {
                                    setConcept(e.target.value);
                                    setSubjectSearchError("");
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      findSubjects();
                                    }
                                  }}
                                  className={inputStyle}
                                  placeholder="e.g. Data structures"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={findSubjects}
                                disabled={isSearchingSubjects}
                                className={`${primaryBtnStyle} sm:px-6 whitespace-nowrap disabled:opacity-60`}
                              >
                                {isSearchingSubjects ? (
                                  <LoadingDots />
                                ) : (
                                  <>
                                    <FaSearch className="text-xs" />
                                    Find
                                  </>
                                )}
                              </button>
                            </div>

                            {subjectSearchError && (
                              <p className="text-red-400 text-xs mt-3 ml-1">
                                {subjectSearchError}
                              </p>
                            )}
                          </div>

                          {/* Suggestions */}
                          {subjectSuggestions.length > 0 && (
                            <div>
                              <p className="text-sm text-purple-300/70 mb-3 ml-1">
                                Matching subject codes
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {subjectSuggestions.map(
                                  (code, index) => (
                                    <div
                                      key={`${code}-${index}`}
                                      className="flex items-center justify-between bg-[#111]/70 border border-purple-500/10 rounded-xl px-4 py-3 hover:border-purple-500/25 transition"
                                    >
                                      <span className="text-sm text-white font-medium">
                                        {code}
                                      </span>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          addSubject(code)
                                        }}
                                        className="text-xs text-purple-300 hover:text-white transition font-medium"
                                      >
                                        Add
                                      </button>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* RIGHT - SUBJECT LIST */}
                        <div className="rounded-2xl bg-[#101010]/75 border border-purple-500/10 p-5 sm:p-6 min-h-[360px] flex flex-col">

                          <div className="flex items-start justify-between mb-5">
                            <div>
                              <h3 className="text-base font-semibold text-white">
                                Your Subjects
                              </h3>

                              <p className="text-xs text-purple-300/45 mt-1">
                                {subjectCount}{" "}
                                {subjectCount === 1
                                  ? "subject"
                                  : "subjects"}{" "}
                                added
                              </p>
                            </div>

                            <div className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/15">
                              <span className="text-xs text-purple-300">
                                {subjectCount}
                              </span>
                            </div>
                          </div>

                          <div className="h-px bg-purple-500/10 mb-4" />

                          {subjectCount === 0 ? (
                            <div className="flex-1 min-h-[220px] flex items-center justify-center text-center px-6">
                              <div>
                                <div className="w-12 h-12 rounded-xl bg-purple-500/[0.06] border border-purple-500/10 flex items-center justify-center mx-auto mb-4">
                                  <FaList className="text-purple-400/40" />
                                </div>

                                <p className="text-sm text-purple-300/45 leading-relaxed">
                                  No subjects added yet.
                                  <br />
                                  Add your first subject to continue.
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-2.5 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
                              {Object.entries(subjects).map(
                                ([key, subject]) => {
                                  const index = key.replace(
                                    "subject",
                                    ""
                                  );

                                  return (
                                    <div
                                      key={key}
                                      className="group flex items-center justify-between bg-[#181818]/80 border border-purple-500/10 rounded-xl px-4 py-3 hover:border-purple-500/25 transition-all"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                          <FaList className="text-purple-400/70 text-[10px]" />
                                        </div>

                                        <span className="text-sm text-white font-medium">
                                          {subject}
                                        </span>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeSubject(index)
                                        }
                                        className="text-xs text-red-400/50 hover:text-red-400 transition flex items-center gap-1.5 opacity-70 group-hover:opacity-100"
                                      >
                                        <FaTimes />
                                        <span className="hidden sm:inline">
                                          Remove
                                        </span>
                                      </button>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Server Error */}
              {formState?.errors?.length > 0 && (
                <div className="mt-6 w-full p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-sm text-red-300 text-center flex items-center justify-center gap-2">
                    <FaExclamationCircle />
                    {formState.errors[0]}
                  </p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-purple-500/10">

                <div>
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className={`${secondaryBtnStyle} flex items-center gap-2`}
                    >
                      <FaArrowLeft className="text-xs" />
                      Back
                    </button>
                  )}
                </div>

                <div>
                  {step < 4 ? (
                    <button
                      key="next-btn"
                      type="button"
                      onClick={handleNextStep}
                      className={primaryBtnStyle}
                    >
                      Continue
                      <FaArrowRight className="text-xs" />
                    </button>
                  ) : (
                    <button
                      key="submit-btn"
                      type="submit"
                      disabled={isPending}
                      className={`${primaryBtnStyle} px-7 disabled:opacity-60`}
                    >
                      {isPending ? (
                        <LoadingDots text="Creating" />
                      ) : (
                        <>
                          Create Account
                          <FaArrowRight className="text-xs" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* Login */}
            <div className="mt-7 text-center">
              <p className="text-sm text-purple-300/50">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Small footer */}
        <p className="text-[10px] text-purple-300/20 mt-5">
          NotesPortal · Your academic resource hub
        </p>
      </div>
    </div>
  );
}

