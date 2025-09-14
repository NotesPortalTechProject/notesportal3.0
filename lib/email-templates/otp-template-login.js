export default function OtpTemplate(otp) {
  return `
  <html>
    <body style="margin:0; padding:0; background-color:#0e0e0e; font-family:'Segoe UI', Arial, Helvetica, sans-serif; color:#f0f0f0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:50px 0; text-align:center;">
        <tr>
          <td align="center">
            <!-- Outer Container -->
            <table width="500" cellpadding="0" cellspacing="0" border="0" style="background-color:#1b1b1b; border-radius:20px; padding:40px; border:1px solid #2c2c2c;">
              
              <!-- Logo / App Name -->
              <tr>
                <td style="font-size:28px; font-weight:600; color:#c084fc; padding-bottom:20px; text-align:center;">
                  NotesPortal
                </td>
              </tr>

              <!-- Message -->
              <tr>
                <td style="font-size:16px; color:#dddddd; padding-bottom:30px; text-align:center; line-height:1.6;">
                  Here's your <strong style="color:#ffffff;">One-Time Password (OTP)</strong> to log in:
                </td>
              </tr>

              <!-- OTP Code Box -->
              <tr>
                <td align="center" style="padding-bottom:30px;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="
                        font-size:38px;
                        font-weight:600;
                        color:#ffffff;
                        background:linear-gradient(90deg, #8b5cf6, #7c3aed);
                        padding:22px 60px;
                        border-radius:24px;
                        letter-spacing:10px;
                        border:1px solid #a855f7;
                      ">
                        ${otp || '------'}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Info -->
              <tr>
                <td style="font-size:14px; color:#aaaaaa; text-align:center; line-height:1.5;">
                  This OTP is valid for <strong style="color:#e2e8f0;">10 minutes</strong>.<br/>
                  Didn’t request this? Just ignore the message.
                </td>
              </tr>

              <!-- Divider -->
              <tr>
                <td style="padding-top:30px;">
                  <hr style="border:0; height:1px; background:#3b0764; width:80%; margin:auto; border-radius:1px;" />
                </td>
              </tr>

              <!-- Instagram Link Footer -->
              <tr>
                <td style="font-size:13px; padding-top:20px;">
                  <a href="https://instagram.com/notesportal.tech" target="_blank" style="color:#a78bfa; text-decoration:underline;">
                     Follow us on Instagram
                  </a>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}
