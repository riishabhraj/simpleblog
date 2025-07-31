import { auth } from "@/lib/auth-v5"

export default auth((req) => {
  const { nextUrl } = req
  const isAuthenticated = !!req.auth

  console.log("Middleware - Auth check:", {
    path: nextUrl.pathname,
    isAuthenticated,
    userEmail: req.auth?.user?.email
  })

  // Protect specific routes
  if (nextUrl.pathname.startsWith("/write") || nextUrl.pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      return Response.redirect(new URL("/signin?callbackUrl=" + encodeURIComponent(nextUrl.pathname), nextUrl))
    }
  }

  return undefined
})

export const config = {
  matcher: ["/write/:path*", "/dashboard/:path*"]
}
