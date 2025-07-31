// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { sendOTPEmail, generateOTP } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Generate OTP
    const otpCode = generateOTP()
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Create user with OTP
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        otpCode,
        otpExpires,
        isVerified: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        isVerified: true,
      }
    })

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otpCode, name)

    if (!emailResult.success) {
      // If email fails, delete the user and return error
      await prisma.user.delete({ where: { id: user.id } })
      return NextResponse.json(
        { error: "Failed to send verification email. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: "User created successfully. Please check your email for verification code.",
        user,
        needsVerification: true
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}