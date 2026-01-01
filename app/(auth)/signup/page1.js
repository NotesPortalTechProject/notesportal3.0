// DUMMY PAGE FOR SIGNUP FORM REBUILD TESTING
"use client"
import { signup } from "@/actions/auth-actions";
import { sendOtpAction, verifyOtpAction } from "@/actions/otp-action";
import { motion, AnimatePresence } from "framer-motion";
import { useActionState, useEffect, useState } from "react";
import Particles from "@/components/ui/particles"; 
import LoadingDots from "@/components/ui/loading-dots";
import { FaUser, FaEnvelope, FaKey, FaCheckCircle, FaExclamationCircle, FaLock, FaListOl, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Link from "next/link";

export default function SignupPage() {
    const [step, setStep] = useState(1);
    const [formState, formAction, isPending] = useActionState(signup, {});

    // STEP 1 - FIRST,LAST AND USERNAME
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");

    // STEP 2 - EMAIL AND OTP VERIFICATION
    const [email, setEmail] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpHash, setOtpHash] = useState("");
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [otpError, setOtpError] = useState("");
    const [emailLoading, setEmailLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);

    // STEP 3
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmpassword] = useState("");
    const [passError, setPassError] = useState("");

    // STEP 4
    const [noOfSubjects, setNoOfSubjects] = useState(0);
    const [subjects, setSubjects] = useState({});

    // Error Navigation Effect
    useEffect(() => {
        if (formState?.errors && formState.errors.length > 0) {
            const errorString = formState.errors.join(" ").toLowerCase();
            if (errorString.includes("first name") || errorString.includes("last name") || errorString.includes("username")) {
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
    }, [formState])

    // SUBJECT CHANGE HANDLERS
    async function handleSubjectsChange(event) {
        const value = parseInt(event.target.value, 10);
        setNoOfSubjects(isNaN(value) ? 0 : value);
    }

    function handleSubjectNameChange(index, value) {
        setSubjects((prev) => ({ ...prev, [`subject${index}`]: value }))
    }

    // STEP HANDLERS
    async function handleNextStep() {
        if (step === 1) {
            if (!firstname || !lastname || !username) {
                alert("Please fill all details");
                return;
            }
            setStep(2);
        }
        else if (step === 2) {
            if (!isEmailVerified) {
                setOtpError("Please verify your email to proceed");
                return;
            }
            setStep(3);
        }
        else if (step === 3) {
            if (!password || !confirmpassword) {
                setPassError("Feilds cannot be empty");
                return;
            }
            if (password !== confirmpassword) {
                setPassError("Passwords do not match");
                return;
            }
            if (password.length < 7) {
                setPassError("Password must atleast be 7 characters long");
                return;
            }
            setPassError("");
            setStep(4);
        }
    }

    function handlePrevStep() {
        if (step > 1) setStep(step - 1);
    }

    // FUNCTION FOR SENDING OTP
    async function sendOtp() {
        if (!email || !email.includes('@')) {
            setOtpError("Please enter a valid email");
            return;
        }
        setEmailLoading(true);
        setOtpError("");

        try {
            const result = await sendOtpAction(email);
            if (result.success) {
                setOtpHash(result.hash);
                setOtpSent(true);
            }
            else {
                setOtpError(result.error);
            }
        }
        catch (error) {
            console.error(error);
            setOtpError("Failed to send Otp. Please try again");
        }
        finally {
            setEmailLoading(false);
        }
    }

    // FUNCTION FOR VERIFYING OTP
    async function verifyOtp() {
        if (!otp) {
            setOtpError("Please enter the OTP");
            return;
        }
        setVerifyLoading(true);
        setOtpError("");

        try {
            const result = await verifyOtpAction(otp, otpHash);

            if (result.success) {
                setIsEmailVerified(true);
                setOtpError("");
            }
            else {
                setOtpError(result.error || "Invalid OTP");
            }
        }
        catch (error) {
            setOtpError("Verification failed");
        }
        finally {
            setVerifyLoading(false);
        }
    }

    // ANIMATION VARIANTS FOR DIVS
    const slideVariants = {
        enter: (direction) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (direction) => ({ x: direction < 0 ? 50 : -50, opacity: 0 }),
    };

    return (
        <div className="relative bg-black h-screen w-screen flex flex-col items-center justify-start px-4 overflow-hidden">
            {/* Particles Background */}
            <div className="absolute inset-0 z-0">
                <Particles particleCount={300} particleSpread={12} speed={0.15} particleColors={["#a855f7", "#8b5cf6", "#c084fc", "#f5d0fe"]} moveParticlesOnHover={true} particleHoverFactor={4} alphaParticles={true} particleBaseSize={320} sizeRandomness={0.7} cameraDistance={35} disableRotation={false} className="pointer-events-none" />
            </div>

            <div className="w-full max-w-5xl flex flex-col items-center justify-center gap-8 px-4 py-6 z-10">
                <h1 className="z-20 text-3xl sm:text-5xl font-medium text-white sm:mt-8 mt-4 tracking-tight px-6 py-3 text-center relative overflow-hidden rounded-2xl shadow-[0_0_12px_rgba(168,85,247,0.3)] bg-gradient-to-br from-[#1a1a1a]/10 to-[#2a1a3d]/30 border border-purple-500/20">
                    <span className="relative z-10">signup to notesportal</span>
                </h1>

                <div className="relative w-full max-w-lg p-8 flex flex-col items-center justify-start overflow-hidden rounded-2xl shadow-[0_0_12px_rgba(168,85,247,0.3)] bg-gradient-to-br from-[#1a1a1a]/10 to-[#2a1a3d]/30 border border-purple-500/20 min-h-[550px]">

                    <div className="flex justify-center gap-6 mb-8 w-full relative z-20">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border ${step >= s ? "bg-purple-600 border-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]" : "bg-transparent border-gray-600 text-gray-500"}`}>{s}</div>
                        ))}
                    </div>

                    <form action={formAction} className="w-full relative z-10 flex flex-col flex-grow">
                        {/* Hidden Inputs */}
                        <input type="hidden" name="firstname" value={firstname} />
                        <input type="hidden" name="lastname" value={lastname} />
                        <input type="hidden" name="username" value={username} />
                        <input type="hidden" name="email" value={email} />
                        <input type="hidden" name="password" value={password} />
                        <input type="hidden" name="confirmpassword" value={confirmpassword} />
                        <input type="hidden" name="nsubjects" value={noOfSubjects} />
                        {Array.from({ length: noOfSubjects }).map((_, index) => (
                            <input key={index} type="hidden" name={`subject${index}`} value={subjects[`subject${index}`] || ""} />
                        ))}

                        <AnimatePresence mode="wait">

                            {/* Step 1: Personal Info */}
                            {step === 1 && (
                                <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex flex-col gap-5 w-full">
                                    <h2 className="text-xl text-purple-200 font-semibold mb-2">Personal Details</h2>
                                    <div><label className="block mb-2 text-sm text-purple-300">Firstname</label><div className="relative"><span className="absolute inset-y-0 left-3 flex items-center text-purple-400"><FaUser /></span><input type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} className="w-full bg-white/5 border border-white/20 text-white rounded-lg px-10 py-2" required /></div></div>
                                    <div><label className="block mb-2 text-sm text-purple-300">Lastname</label><div className="relative"><span className="absolute inset-y-0 left-3 flex items-center text-purple-400"><FaUser /></span><input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} className="w-full bg-white/5 border border-white/20 text-white rounded-lg px-10 py-2" required /></div></div>
                                    <div><label className="block mb-2 text-sm text-purple-300">Username</label><div className="relative"><span className="absolute inset-y-0 left-3 flex items-center text-purple-400"><FaUser /></span><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-white/5 border border-white/20 text-white rounded-lg px-10 py-2" required /></div></div>
                                </motion.div>
                            )}

                            {/* Step 2: Email Verification*/}
                            {step === 2 && (
                                <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex flex-col gap-5 w-full">
                                    <h2 className="text-xl text-purple-200 font-semibold mb-2">Verification</h2>

                                    <div>
                                        <label className="block mb-2 text-sm text-purple-300 font-medium">Email</label>
                                        <div className="relative flex gap-2">
                                            <div className="relative flex-grow">
                                                <span className="absolute inset-y-0 left-3 flex items-center text-purple-400"><FaEnvelope /></span>
                                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={otpSent || isEmailVerified} className="w-full bg-white/5 border border-white/20 text-white rounded-lg px-10 py-2 disabled:opacity-50" />
                                            </div>
                                            {!otpSent && !isEmailVerified && (
                                                <button type="button" onClick={sendOtp} disabled={emailLoading} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition min-w-[100px] flex justify-center items-center">
                                                    {emailLoading ? <LoadingDots /> : "Send OTP"}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {otpSent && !isEmailVerified && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                            <label className="block mb-2 text-sm text-purple-300 font-medium">Enter OTP</label>
                                            <div className="relative flex gap-2">
                                                <div className="relative flex-grow">
                                                    <span className="absolute inset-y-0 left-3 flex items-center text-purple-400"><FaKey /></span>
                                                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-white/5 border border-white/20 text-white rounded-lg px-10 py-2" />
                                                </div>
                                                <button type="button" onClick={verifyOtp} disabled={verifyLoading} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition min-w-[80px] flex justify-center items-center">
                                                    {verifyLoading ? <LoadingDots /> : "Verify"}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {isEmailVerified && (
                                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-3 bg-green-500/20 border border-green-500/40 rounded-lg flex items-center gap-3 text-green-200">
                                            <FaCheckCircle className="text-xl" /> <span>Email Verified Successfully</span>
                                        </motion.div>
                                    )}

                                    {otpError && <div className="flex items-center gap-2 text-red-400 text-sm mt-1"><FaExclamationCircle /> {otpError}</div>}
                                </motion.div>
                            )}

                            {/* Step 3: Password */}
                            {step === 3 && (
                                <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex flex-col gap-5 w-full">
                                    <h2 className="text-xl text-purple-200 font-semibold mb-2">Security</h2>
                                    <div><label className="block mb-2 text-sm text-purple-300">Password</label><div className="relative"><span className="absolute inset-y-0 left-3 flex items-center text-pink-400"><FaLock /></span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/20 text-white rounded-lg px-10 py-2 focus:ring-pink-500" /></div></div>
                                    <div><label className="block mb-2 text-sm text-purple-300">Confirm Password</label><div className="relative"><span className="absolute inset-y-0 left-3 flex items-center text-pink-400"><FaKey /></span><input type="password" value={confirmpassword} onChange={(e) => setConfirmpassword(e.target.value)} className="w-full bg-white/5 border border-white/20 text-white rounded-lg px-10 py-2 focus:ring-pink-500" /></div></div>
                                    {passError && <div className="flex items-center gap-2 text-red-400 text-sm"><FaExclamationCircle /> {passError}</div>}
                                </motion.div>
                            )}

                            {/* Step 4: Subjects */}
                            {step === 4 && (
                                <motion.div key="step4" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex flex-col gap-5 w-full h-full">
                                    <h2 className="text-xl text-purple-200 font-semibold mb-2">Academics</h2>
                                    <div><label className="block mb-2 text-sm text-purple-300">Number of Subjects</label><div className="relative"><span className="absolute inset-y-0 left-3 flex items-center text-purple-400"><FaListOl /></span><input type="number" value={noOfSubjects} onChange={handleSubjectsChange} min="0" max="15" className="w-full bg-white/5 border border-white/20 text-white rounded-lg px-10 py-2" /></div></div>
                                    <div className="flex-grow overflow-y-auto max-h-[220px] scrollbar-thin scrollbar-thumb-purple-600/50 pr-2 space-y-3">
                                        {Array.from({ length: noOfSubjects }, (_, index) => (
                                            <div key={index} className="animate-in fade-in slide-in-from-bottom-2 duration-300"><label className="block mb-1 text-xs text-purple-300">Subject {index + 1}:</label><input type="text" value={subjects[`subject${index}`] || ""} onChange={(e) => handleSubjectNameChange(index, e.target.value)} placeholder={`Subject Code ${index + 1}`} required className="w-full bg-white/5 border border-white/20 text-white rounded-lg px-3 py-2 text-sm uppercase" /></div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {formState?.errors?.length > 0 && (
                            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg animate-pulse">
                                <ul className="text-sm text-red-300 space-y-1 text-center font-medium">
                                    {formState.errors.map((error, index) => <li key={index} className="flex items-center justify-center gap-2"><FaExclamationCircle /> {error}</li>)}
                                </ul>
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-6 w-full border-t border-white/10 pt-4">
                            <div className="w-1/3">{step > 1 && <button type="button" onClick={handlePrevStep} className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm font-medium"><FaArrowLeft /> Back</button>}</div>
                            <div className="w-2/3 flex justify-end">
                                {step < 4 ? <button type="button" onClick={handleNextStep} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition shadow-lg font-medium">Next <FaArrowRight /></button> : <button type="submit" disabled={isPending} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-2 rounded-lg flex items-center gap-2 transition shadow-lg font-medium">{isPending ? <LoadingDots text="Creating Account" /> : "Complete Signup"}</button>}
                            </div>
                        </div>
                    </form>
                    <p className="mt-4 text-center text-sm text-gray-400 relative z-10">Already have an account? <Link href="/login" className="text-purple-400 hover:underline">Login</Link></p>
                </div>
            </div>
        </div>
    );
}