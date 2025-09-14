import StoreOtpWithEmailId from "@/lib/data-push-functions";
import { SendOTPEmail } from "@/lib/mail-send";

export async function POST(req) {
    try {
        const body = await req.json();
        const { to, subject, html, otp } = body;

        if (!to || !otp) {
            return Response.json({ success: false, message: 'Missing emailid or OTP' }, { status: 400 });
        }

        await StoreOtpWithEmailId(otp, to);

        const result = await SendOTPEmail({ to, subject, html });

        if (!result.success) {
            return Response.json({ success: false, message: result.error || "Failed to send email" }, { status: 500 });
        }

        return Response.json({
            success: true,
            message: "Mail sent successfully",
            id: result.messageId,
            serverResponse: result.response,
        },
            { status: 200 }
        );
    }catch(error){
        console.error("API error:",error);
        return Response.json({success:false,message:error.message},{status:500})
    }
}