// app/verify-email/page.tsx
"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PenTool, Mail, RefreshCw } from "lucide-react"
import Link from "next/link"

function VerifyEmailContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get('email')

    const [otpCode, setOtpCode] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds

    // Countdown timer
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [timeLeft])

    // Redirect if no email
    useEffect(() => {
        if (!email) {
            router.push('/register')
        }
    }, [email, router])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (!otpCode || otpCode.length !== 6) {
            setError("Please enter a valid 6-digit code")
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    otpCode,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                setSuccess("Email verified successfully!")
                setTimeout(() => {
                    router.push("/signin?message=Email verified. Please sign in.")
                }, 2000)
            } else {
                setError(data.error || "Verification failed")
            }
        } catch {
            setError("An error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendOTP = async () => {
        setError("")
        setSuccess("")
        setIsResending(true)

        try {
            const response = await fetch("/api/auth/resend-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

            if (response.ok) {
                setSuccess("New verification code sent!")
                setTimeLeft(600) // Reset timer
            } else {
                setError(data.error || "Failed to resend code")
            }
        } catch {
            setError("An error occurred. Please try again.")
        } finally {
            setIsResending(false)
        }
    }

    if (!email) {
        return null // Will redirect
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="px-4 lg:px-6 h-14 flex items-center border-b">
                <Link className="flex items-center justify-center" href="/">
                    <PenTool className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                    <span className="font-bold text-base sm:text-lg">SimpleBlog</span>
                </Link>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
                <Card className="w-full max-w-md mx-auto">
                    <CardHeader className="text-center space-y-2 pb-4 sm:pb-6">
                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <Mail className="h-8 w-8 text-blue-600" />
                        </div>
                        <CardTitle className="text-xl sm:text-2xl">Verify Your Email</CardTitle>
                        <CardDescription className="text-sm sm:text-base">
                            We&apos;ve sent a 6-digit verification code to<br />
                            <strong>{email}</strong>
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4 sm:space-y-6">
                        {/* Error/Success Messages */}
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="otpCode" className="text-sm sm:text-base">
                                    Enter Verification Code
                                </Label>
                                <Input
                                    id="otpCode"
                                    name="otpCode"
                                    type="text"
                                    placeholder="000000"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    required
                                    className="text-center text-2xl font-mono tracking-widest"
                                    maxLength={6}
                                />
                            </div>

                            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                {isLoading ? "Verifying..." : "Verify Email"}
                            </Button>
                        </form>

                        {/* Timer and Resend */}
                        <div className="text-center space-y-2">
                            {timeLeft > 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    Code expires in {formatTime(timeLeft)}
                                </p>
                            ) : (
                                <p className="text-sm text-red-600">Code has expired</p>
                            )}

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleResendOTP}
                                disabled={isResending || timeLeft > 540} // Can resend after 1 minute
                                className="text-sm"
                            >
                                <RefreshCw className={`mr-2 h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
                                {isResending ? "Sending..." : "Resend Code"}
                            </Button>

                            {timeLeft > 540 && (
                                <p className="text-xs text-muted-foreground">
                                    You can resend in {formatTime(timeLeft - 540)}
                                </p>
                            )}
                        </div>

                        <div className="text-center text-xs sm:text-sm text-muted-foreground">
                            Wrong email?{" "}
                            <Link href="/register" className="font-medium text-primary hover:underline">
                                Sign up again
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

// Loading fallback component
function VerifyEmailLoading() {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="px-4 lg:px-6 h-14 flex items-center border-b">
                <Link className="flex items-center justify-center" href="/">
                    <PenTool className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                    <span className="font-bold text-base sm:text-lg">SimpleBlog</span>
                </Link>
            </header>
            <div className="flex-1 flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
                <Card className="w-full max-w-md mx-auto">
                    <CardHeader className="text-center space-y-2 pb-4 sm:pb-6">
                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <Mail className="h-8 w-8 text-blue-600 animate-pulse" />
                        </div>
                        <CardTitle className="text-xl sm:text-2xl">Loading...</CardTitle>
                        <CardDescription className="text-sm sm:text-base">
                            Please wait while we load the verification page.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}

// Main export with Suspense wrapper
export default function VerifyEmail() {
    return (
        <Suspense fallback={<VerifyEmailLoading />}>
            <VerifyEmailContent />
        </Suspense>
    )
}