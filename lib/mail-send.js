import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export async function SendOTPEmail({ to, subject, html }) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    return transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        html
    });
}