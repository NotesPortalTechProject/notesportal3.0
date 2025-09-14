import nodemailer from "nodemailer";

export async function SendOTPEmail({to,subject,html}) {
    try{
        const transporter = nodemailer.createTransport({
            host:process.env.SMTP_HOST,
            port:Number(process.env.SMTP_PORT),
            secure:process.env.SMTP_SECURE === "true",
            auth:{
                user:process.env.SMTP_USER,
                pass:process.env.SMTP_PASS,
            },
            logger:true,
            debug:true,
        });

        await transporter.verify();

        const info = await transporter.sendMail({
            from:process.env.SMTP_FROM || process.env.SMTP_USER,
            to,
            subject,
            text: `Your OTP for NotesPortal login is: ${otp}. It is valid for 10 minutes.`,
            html,
        });

        console.log("Email Sent: ",info.messageId);
        return {success:true,messageId:info.messageId};
    }catch(error){
        console.error("Email sending failed: ",error);
        return {success:false,error:error.message};
    }
}