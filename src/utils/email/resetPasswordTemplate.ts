export const resetPasswordTemplate = function ({
  fullName,
  passwordResetLink,
  linkExpiresIn,
}: {
  fullName: string;
  passwordResetLink: string;
  linkExpiresIn: string;
}): string {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Reset Your Password</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f5f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f7fa;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
          
          <!-- Header with gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                Password Reset Request
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 50px 40px 30px;">
              <p style="margin: 0 0 20px; color: #334155; font-size: 16px; line-height: 1.6;">
                Hello <strong>${fullName}</strong>,
              </p>
              <p style="margin: 0 0 20px; color: #334155; font-size: 16px; line-height: 1.6;">
                We received a request to reset your password. If you didn't make this request, you can safely ignore this email.
              </p>
              <p style="margin: 0 0 30px; color: #334155; font-size: 16px; line-height: 1.6;">
                To reset your password, click the button below:
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center; padding: 0 0 30px;">
                    <a href="${passwordResetLink}"
                       style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; letter-spacing: 0.3px; box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3); transition: all 0.3s ease;">
                      Reset Your Password
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Expiry notice -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="background-color: #f1f5f9; border-left: 4px solid #0ea5e9; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                    <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.5;">
                      <strong>⏰ Important:</strong> This link will expire in ${linkExpiresIn} for security reasons.
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Alternative link -->
              <p style="margin: 30px 0 10px; color: #64748b; font-size: 14px; line-height: 1.6;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin: 0 0 30px; word-break: break-all;">
                <a href="${passwordResetLink}" style="color: #0ea5e9; text-decoration: none; font-size: 14px;">
                  ${passwordResetLink.replace(/"/g, "")}
                </a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px 40px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 12px; color: #64748b; font-size: 13px; line-height: 1.5;">
                If you didn't request a password reset, please contact our support team immediately.
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.5;">
                © ${new Date().getFullYear()} Write-it-down. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  return html;
};
