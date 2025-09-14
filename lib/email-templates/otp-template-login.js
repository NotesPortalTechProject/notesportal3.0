export default function OtpTemplate(otp) {
  return `
    <div style="background-color:#0d0d0d; color:#e5e5e5; font-family:Poppins, Arial, sans-serif; padding:40px; text-align:center;">
      <div style="max-width:500px; margin:auto; background:#1a1a1a; border:1px solid #333; border-radius:12px; padding:30px;">
        <h1 style="font-size:26px; color:#c084fc; margin-bottom:10px;">NotesPortal</h1>
        <p style="font-size:16px; color:#d4d4d4;">Your One-Time Password (OTP) for login:</p>
        
        <div style="margin:30px 0;">
          <span style="
            display:inline-block;
            font-size:40px;
            font-weight:600;
            color:#fff;
            background:linear-gradient(90deg,#a855f7,#9333ea);
            padding:16px 36px;
            border-radius:10px;
            letter-spacing:6px;
          ">
            ${otp || "------"}
          </span>
        </div>

        <p style="font-size:14px; color:#aaaaaa;">This OTP is valid for 10 minutes. If you didn’t request this, you can safely ignore this email.</p>
      </div>
    </div>
  `;
}
