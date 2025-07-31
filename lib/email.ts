// lib/email.ts
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use App Password for Gmail
    },
})

export async function sendOTPEmail(email: string, otpCode: string, name: string) {
    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email - SimpleBlog',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }
          .otp-code {
            font-size: 32px;
            font-weight: bold;
            color: #2563eb;
            background: #eff6ff;
            padding: 20px;
            text-align: center;
            border-radius: 8px;
            margin: 20px 0;
            letter-spacing: 4px;
          }
          .footer { color: #666; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🖊️ SimpleBlog</h1>
            <h2>Verify Your Email Address</h2>
          </div>

          <p>Hi ${name},</p>

          <p>Thank you for signing up for SimpleBlog! To complete your registration, please verify your email address using the OTP code below:</p>

          <div class="otp-code">${otpCode}</div>

          <p><strong>This code will expire in 10 minutes.</strong></p>

          <p>If you didn't create an account with SimpleBlog, please ignore this email.</p>

          <div class="footer">
            <p>Best regards,<br>The SimpleBlog Team</p>
          </div>
        </div>
      </body>
      </html>
    `,
    }

    try {
        await transporter.sendMail(mailOptions)
        return { success: true }
    } catch (error) {
        console.error('Email sending failed:', error)
        return { success: false, error }
    }
}

// Generate 6-digit OTP
export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
}