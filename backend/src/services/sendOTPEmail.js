import nodemailer from "nodemailer";

const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Confirm Your Account — AURA",
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify Your Account</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="480" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 16px; overflow: hidden;">
              
              <!-- Brand Header -->
              <tr>
                <td align="center" style="padding: 40px 40px 20px 40px;">
                  <h1 style="margin: 0; font-size: 32px; font-weight: 700; tracking: 0.3em; letter-spacing: 0.3em; text-transform: uppercase; color: #0a0a0a;">
                    AURA
                  </h1>
                  <p style="margin: 10px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #737373;">
                    Timeless Archive / Curation
                  </p>
                </td>
              </tr>

              <!-- Divider -->
              <tr>
                <td style="padding: 0 40px;">
                  <div style="border-bottom: 1px solid #f5f5f5;"></div>
                </td>
              </tr>

              <!-- Message Body -->
              <tr>
                <td style="padding: 40px 40px 30px 40px; text-align: center;">
                  <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 400; color: #171717; letter-spacing: -0.01em;">
                    Verify Your Email Address
                  </h2>
                  <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #525252; font-weight: 300;">
                    Thank you for joining our community. Use the secure verification code below to complete your registration and unlock early access to our weekly drops.
                  </p>
                </td>
              </tr>

              <!-- OTP Display Box -->
              <tr>
                <td align="center" style="padding: 0 40px 30px 40px;">
                  <table border="0" cellspacing="0" cellpadding="0" style="background-color: #f9f9f9; border-radius: 12px; width: 100%;">
                    <tr>
                      <td align="center" style="padding: 24px; letter-spacing: 0.25em;">
                        <span style="font-size: 36px; font-weight: 700; color: #0a0a0a; font-family: monospace, Courier, monospace;">
                          ${otp}
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Expiry Alert -->
              <tr>
                <td style="padding: 0 40px 40px 40px; text-align: center;">
                  <p style="margin: 0; font-size: 12px; color: #a3a3a3; font-weight: 300;">
                    This code is valid for the next 10 minutes. If you did not request this email, please safely disregard it.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="padding: 24px 40px; background-color: #fafafa; border-top: 1px solid #e5e5e5;">
                  <p style="margin: 0; font-size: 11px; color: #737373; letter-spacing: 0.05em;">
                    © 2026 AURA Atelier. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
});
};

export default sendOTPEmail;