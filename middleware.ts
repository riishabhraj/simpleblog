import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect /write and /dashboard routes
        if (req.nextUrl.pathname.startsWith("/write") ||
            req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/write/:path*", "/dashboard/:path*"]
}