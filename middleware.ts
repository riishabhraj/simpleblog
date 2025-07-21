// import { withAuth } from "next-auth/middleware"

// export default withAuth(
//   function middleware(req) {
//     // Add any additional logic here if needed
//   },
//   {
//     callbacks: {
//       authorized: ({ token, req }) => {
//         // Protect /write and /dashboard routes
//         if (req.nextUrl.pathname.startsWith("/write") ||
//             req.nextUrl.pathname.startsWith("/dashboard")) {
//           return !!token
//         }
//         return true
//       },
//     },
//   }
// )

// export const config = {
//   matcher: ["/write/:path*", "/dashboard/:path*"]
// }

// middleware.ts
import { withAuth } from "next-auth/middleware"

export default withAuth(
    function middleware(req) {
        console.log("Middleware - Token exists:", !!req.nextauth.token)
        console.log("Middleware - Path:", req.nextUrl.pathname)
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl

                // Protect specific routes
                if (pathname.startsWith("/write") || pathname.startsWith("/dashboard")) {
                    console.log("Checking auth for protected route:", pathname, "Token:", !!token)
                    return !!token
                }

                // Allow all other routes
                return true
            },
        },
        pages: {
            signIn: "/signin",
        },
    }
)

export const config = {
    matcher: [
        // Match /write and /dashboard routes
        "/write",
        "/write/:path*",
        "/dashboard",
        "/dashboard/:path*"
    ]
}