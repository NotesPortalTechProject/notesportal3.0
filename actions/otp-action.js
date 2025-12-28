"use server"

import { generateOtp } from "@/lib/gen-otp";
import { EmailExists } from "./other-actions";
import { SendOTPEmail } from "@/lib/mail-send";
import OtpAccountVerification from "@/lib/email-templates/otp-acc-verification";


export async function sendOtpAction(email) {
    try{
        if(!email) return { success:false,error:"Email is required"};

        const exists = await EmailExists(email);
        if(exists){
            return { success:false,error:"Account with this email already exists"};
        }

        const otp = generateOtp();

        const emailResult = await SendOTPEmail({
            to:email,
            subject:"Verify your email - Notesportal",
            html:OtpAccountVerification(otp)
        });

        if(!emailResult.success){
            return { success:false, error:"Failed to send email"};
        }

        const hash = crypto.createHmac("sha356",process.env.OTP_SECRET).update(otp).digest("hex");

        return {success:true,hash};
    }
    catch (error){
        console.error("OTP ACTION ERROR: ",error);
        return { success:false, error:"Internal server error"};
    }
}

export async function verifyOtpAction(userOtp,ogHash){
    try{
        const inputHash = crypto.createHmac("sha356",process.env.OTP_SECRET).update(userOtp).digest("hex");
        
        if(inputHash===ogHash){
            return {success:true};
        }else{
            return {success:false,error:"Invalid Otp"};
        }
    }
    catch(error){
        return {success:false,error:"Verification failed"};
    }
}