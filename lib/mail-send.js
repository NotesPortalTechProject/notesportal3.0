import nodemailer from 'nodemailer'
export async function SendOTPEmail({to,subject,html}) {
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.EMAIL_ID,
            pass:process.env.EMAIL_KEY
        }
    });

    return transporter.sendMail({
        from: process.env.EMAIL_ID,
        to:to,
        subject:subject,
        html:html
    })
}
