import { signup } from "@/actions/auth-actions";
import { sendOtpAction, verifyOtpAction } from "@/actions/otp-action";
import { P } from "framer-motion/dist/types.d-DagZKalS";
import { useActionState, useEffect, useState } from "react";

export default function SignupPage(){
    const [step,setStep] = useState(1);
    const [formState,formAction,isPending] = useActionState(signup,{});

    // STEP 1 - FIRST,LAST AND USERNAME
    const [firstname,setFirstname] = useState("");
    const [lastname,setLastname] = useState("");
    const [username,setUsername] = useState("");

    // STEP 2 - EMAIL AND OTP VERIFICATION
    const [email,setEmail] = useState("");
    const [otpSent,setOtpSent] = useState(false);
    const [otp,setOtp] = useState("");
    const [otpHash,setOtpHash] = useState("");
    const [isEmailVerified,setIsEmailVerified] = useState(false);
    const [otpError,setOtpError] = useState("");
    const [emailLoading,setEmailLoading] = useState(false);
    const [verifyLoading,setVerifyLoading] = useState(false);

    // STEP 3
    const [password,setPassword] = useState("");
    const [confirmpassword,setConfirmpassword] = useState("");
    const [passError,setPassError] = useState("");

    // STEP 4
    const [noOfSubjects,setNoOfSubjects] = useState(0);
    const [subjects,setSubjects] = useState({});

    // Error Navigation Effect
    useEffect(()=>{
        if(formState?.errors && formState.errors.length>0){
            const errorString = formState.errors.join(" ").toLowerCase();
            if(errorString.includes("first name")||errorString.includes("last name")||errorString.includes("username")){
                setStep(1);
                return;
            }
            if(errorString.includes("email")){
                setStep(2);
                return;
            }
            if(errorString.includes("password")||errorString.includes("match")){
                setStep(3);
                return;
            }
            if(errorString.includes("subject")||errorString.includes("provided")){
                setStep(4);
                return;
            }
        }
    },[formState])

    // SUBJECT CHANGE HANDLERS
    async function handleSubjectsChange(event) {
        const value = parseInt(event.target.value,10);
        setNoOfSubjects(isNaN(value) ? 0 : value);
    }

    function handleSubjectNameChange(index,value){
        setSubjects((prev)=>({...prev,[`subject${index}`]:value}))
    }

    // STEP HANDLERS
    async function handleNextStep() {
        if(step===1){
            if(!firstname||!lastname||!username){
                alert("Please fill all details");
                return;
            }
            setStep(2);
        }
        else if(step===2){
            if(!isEmailVerified){
                setOtpError("Please verify your email to proceed");
                return;
            }
            setStep(3);
        }
        else if(step===3){
            if(!password||!confirmpassword){
                setPassError("Feilds cannot be empty");
                return;
            }
            if(password!==confirmpassword){
                setPassError("Passwords do not match");
                return;
            }
            if(password.length<7){
                setPassError("Password must atleast be 7 characters long");
                return;
            }
            setPassError("");
            setStep(4);
        }
    }

    function handlePrevStep(){
        if(step>1) setStep(step-1);
    }

    // FUNCTION FOR SENDING OTP
    async function sendOtp() {
        if(!email||!email.includes('@')){
            setOtpError("Please enter a valid email");
            return;
        }
        setEmailLoading(true);
        setOtpError("");

        try{
            const result = await sendOtpAction(email);
            if(result.success){
                setOtpHash(result.hash);
                setOtpSent(true);
            }
            else{
                setOtpError(result.error);
            }
        }
        catch(error){
            console.error(error);
            setOtpError("Failed to send Otp. Please try again");
        }
        finally{
            setEmailLoading(false);
        }
    }

    // FUNCTION FOR VERIFYING OTP
    async function verifyOtp() {
        if(!otp){
            setOtpError("Please enter the OTP");
            return;
        }
        setVerifyLoading(true);
        setOtpError("");

        try{
            const result = await verifyOtpAction(otp,otpHash);

            if(result.success){
                setIsEmailVerified(true);
                setOtpError("");
            }
            else{
                setOtpError(result.error||"Invalid OTP");
            }
        }
        catch(error){
            setOtpError("Verification failed");
        }
        finally{
            setVerifyLoading(false);
        }
    }

    // ANIMATION VARIANTS FOR DIVS
    const slideVariants = {
        enter: (direction)=>({x:direction > 0 ? 50 : -50, opacity: 0}),
        center:{x:0, opacity: 1},
        exit: (direction)=>({x:direction < 0 ? 50 : -50, opacity: 0}),
    };
    
}