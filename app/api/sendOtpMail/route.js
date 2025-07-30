import StoreOtpWithEmailId from "@/lib/data-push-functions";
import { SendOTPEmail } from "@/lib/mail-send";

export async function POST(req) {
    try{
        const body = await req.json();
        const {to,subject,html,otp} = body;

        await StoreOtpWithEmailId(otp,to)
        await SendOTPEmail({to,subject,html,otp});

        return Response.json({success:true,message:'mail sent'});
    } catch (error){
        return Response.json({success:false,message:error.message},{status:500});
    }
}