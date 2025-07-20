import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, PenTool } from "lucide-react"
import Link from "next/link"

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <PenTool className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
          <span className="font-bold text-base sm:text-lg">SimpleBlog</span>
        </Link>
        <nav className="ml-auto">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/signin">
            Back to Sign In
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center space-y-2 pb-4 sm:pb-6">
            <CardTitle className="text-xl sm:text-2xl">Reset Your Password</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Enter your email address and we&apos;ll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  required
                  className="text-sm sm:text-base"
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                <Mail className="mr-2 h-4 w-4" />
                <span className="text-sm sm:text-base">Send Reset Link</span>
              </Button>
            </form>

            <div className="text-center">
              <Link
                href="/signin"
                className="inline-flex items-center text-xs sm:text-sm text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="mr-1 h-3 w-3" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
