export default function OtpTemplateSetResetPass(otp, type = "reset") {
  const isSet = type === "set";
  return `
    <!doctype html><html lang="und" dir="auto" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><title>OTP Email</title><!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style type="text/css">#outlook a { padding:0; }
      body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
      table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
      img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
      p { display:block;margin:13px 0; }</style><!--[if mso]>
    <noscript>
    <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    </noscript>
    <![endif]--><!--[if lte mso 11]>
    <style type="text/css">
      .mj-outlook-group-fix { width:100% !important; }
    </style>
    <![endif]--><!--[if !mso]><!--><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" type="text/css"><style type="text/css">@import url(https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap);</style><!--<![endif]--><style type="text/css">@media only screen and (min-width:480px) {
        .mj-column-per-100 { width:100% !important; max-width: 100%; }
      }</style><style media="screen and (min-width:480px)">.moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }</style><style type="text/css">body { background-color: #0d0d0d !important; }</style></head><body style="word-spacing:normal;background-color:#0d0d0d;"><div aria-label="OTP Email" aria-roledescription="email" style="background-color:#0d0d0d;" role="article" lang="und" dir="auto"><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><div style="margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:40px 20px;text-align:center;"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:560px;" ><![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tbody><!-- Title --><tr><td align="center" style="font-size:0px;padding:0 0 10px 0;word-break:break-word;"><div style="font-family:Poppins, Arial, sans-serif;font-size:28px;font-weight:600;line-height:1;text-align:center;color:#c084fc;">NotesPortal</div></td></tr><!-- Subtitle --><tr><td align="center" style="font-size:0px;padding:0 0 24px 0;word-break:break-word;"><div style="font-family:Poppins, Arial, sans-serif;font-size:16px;line-height:1;text-align:center;color:#d4d4d4;">
      ${isSet ? 'Use the OTP below to verify your set password request:' : 'Use the OTP below to verify your password reset request:'}
      </div></td></tr><!-- OTP --><tr><td align="center" style="font-size:0px;padding:0 0 30px 0;word-break:break-word;"><div style="font-family:Poppins, Arial, sans-serif;font-size:13px;line-height:1;text-align:center;color:#e5e5e5;"><span style="display: inline-block;
            font-size: 42px;
            font-weight: 600;
            color: #fff;
            background: linear-gradient(90deg, #a855f7, #9333ea);
            padding: 20px 40px;
            border-radius: 12px;
            letter-spacing: 6px;
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
            text-shadow: 0 2px 8px rgba(147, 51, 234, 0.6);">
            ${otp || "------"}
            </span></div></td></tr><!-- Footer --><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:Poppins, Arial, sans-serif;font-size:14px;line-height:1.5;text-align:center;color:#aaaaaa;">This OTP is valid for 10 minutes.<br>If you didn’t request this, you can safely ignore this email.</div></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></div></body></html>
  `;
}