"use server"
import { generateOtp } from "@/lib/gen-otp";
import { EmailExists } from "./other-actions";
import { SendOTPEmail } from "@/lib/mail-send";
import crypto from "crypto";
import OtpAccountVerification from "@/lib/email-templates/otp-acc-verification";
import OtpTemplateLogin from "@/lib/email-templates/otp-template-login";
import OtpTemplateSetResetPass from "@/lib/email-templates/otp-template-pass";
import { error } from "console";


export async function sendOtpAction(email, template) {
    try {
        if (!email) return { success: false, error: "Email is required" };

        // dont want this check for other requests other than signup
        if (template === "signupAccVerification") {
            const exists = await EmailExists(email);
            if (!exists) {
                return { success: false, error: "Account with this email already exists" };
            }
        }

        const otp = generateOtp();
        let emailResult;

        if (template === "loginotp") {
            emailResult = await SendOTPEmail({
                to: email,
                subject: "Login to Notesportal",
                html: OtpTemplateLogin(otp)
            })
        }
        else if (template === "signupAccVerification") {
            emailResult = await SendOTPEmail({
                to: email,
                subject: "Verify your email - Notesportal",
                html: OtpAccountVerification(otp)
            })
        }
        else if (template === "reset") {
            emailResult = await SendOTPEmail({
                to: email,
                subject: "Reset your password - Notesportal",
                html: OtpTemplateSetResetPass(otp, "reset")
            })
        }
        else if (template === "set") {
            emailResult = await SendOTPEmail({
                to: email,
                subject: "Set your password -  Notesportal",
                html: OtpTemplateSetResetPass(otp, "set")
            })
        }
        else {
            return { success: false, error: "Problem with template selection" }
        }


        if (!emailResult.success) {
            return { success: false, error: "Failed to send email" };
        }

        const hash = crypto.createHmac("sha256", process.env.OTP_SECRET).update(otp).digest("hex");

        return { success: true, hash };
    }
    catch (error) {
        console.error("OTP ACTION ERROR: ", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function verifyOtpAction(userOtp, ogHash) {
    try {
        const inputHash = crypto.createHmac("sha256", process.env.OTP_SECRET).update(userOtp).digest("hex");

        if (inputHash === ogHash) {
            return { success: true };
        } else {
            return { success: false, error: "Invalid Otp" };
        }
    }
    catch (error) {
        return { success: false, error: "Verification failed" };
    }
}
