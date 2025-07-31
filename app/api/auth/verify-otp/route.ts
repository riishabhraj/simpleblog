// app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, otpCode } = body

        if (!email || !otpCode) {
            return NextResponse.json(
                { error: "Email and OTP code are required" },
                { status: 400 }
            )
        }

        // Find user with matching email and OTP
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

        if (!user.otpCode || !user.otpExpires) {
            return NextResponse.json(
                { error: "No OTP found. Please request a new one." },
                { status: 400 }
            )
        }

        // Check if OTP has expired
        if (new Date() > user.otpExpires) {
            return NextResponse.json(
                { error: "OTP has expired. Please request a new one." },
                { status: 400 }
            )
        }

        // Check if OTP matches
        if (user.otpCode !== otpCode) {
            return NextResponse.json(
                { error: "Invalid OTP code" },
                { status: 400 }
            )
        }

        // Mark user as verified and clear OTP fields
        const verifiedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                emailVerified: new Date(),
                otpCode: null,
                otpExpires: null,
            },
            select: {
                id: true,
                name: true,
                email: true,
                isVerified: true,
                emailVerified: true,
            }
        })

        return NextResponse.json(
            {
                message: "Email verified successfully!",
                user: verifiedUser
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error verifying OTP:", error)
        return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 })
    }
}