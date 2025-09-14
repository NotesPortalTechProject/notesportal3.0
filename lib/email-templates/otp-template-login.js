export default function OtpTemplate(otp) {
  return `
    <div style="background-color: #0d0d0d; color: #e5e5e5; font-family: 'Poppins', sans-serif; padding: 40px; text-align: center;">
      <!-- Google Font Import -->
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />

      <div style="max-width: 500px; margin: auto; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 40px 30px; backdrop-filter: blur(10px); box-shadow: 0 8px 20px rgba(0,0,0,0.4);">
        <h1 style="font-size: 28px; color: #c084fc; margin-bottom: 10px;">NotesPortal</h1>
        <p style="font-size: 16px; color: #d4d4d4;">Your One-Time Password (OTP) for login:</p>
        
        <div style="margin: 30px 0;">
          <span style="
            display: inline-block;
            font-size: 42px;
            font-weight: 600;
            color: #fff;
            background: linear-gradient(90deg, #a855f7, #9333ea);
            padding: 20px 40px;
            border-radius: 12px;
            letter-spacing: 6px;
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
            text-shadow: 0 2px 8px rgba(147, 51, 234, 0.6);
          ">
            ${otp || '------'}
          </span>
        </div>

        <p style="font-size: 14px; color: #888888;">This OTP is valid for 10 minutes. If you didn’t request this, you can safely ignore this email.</p>
      </div>
    </div>
  `;
}