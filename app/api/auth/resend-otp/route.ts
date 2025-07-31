// app/api/auth/resend-otp/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendOTPEmail, generateOTP } from "@/lib/email"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email } = body

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            )
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        if (user.isVerified) {
            return NextResponse.json(
                { error: "Email is already verified" },
                { status: 400 }
            )
        }

        // Generate new OTP
        const otpCode = generateOTP()
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

        // Update user with new OTP
        await prisma.user.update({
            where: { id: user.id },
            data: {
                otpCode,
                otpExpires,
            }
        })

        // Send OTP email
        const emailResult = await sendOTPEmail(email, otpCode, user.name || 'User')

        if (!emailResult.success) {
            return NextResponse.json(
                { error: "Failed to send verification email. Please try again." },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { message: "New verification code sent to your email." },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error resending OTP:", error)
        return NextResponse.json({ error: "Failed to resend OTP" }, { status: 500 })
    }
}