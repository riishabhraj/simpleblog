import { auth } from "@/lib/auth-v5"

/**
 * Server-side authentication wrapper that handles NextAuth.js v5 + Next.js 15 compatibility issues.
 *
 * This wrapper temporarily suppresses specific console warnings related to async headers usage
 * in NextAuth.js v5. These warnings don't affect functionality and will be resolved when
 * NextAuth.js fully supports Next.js 15.
 *
 * Warnings being suppressed:
 * - "`headers()` should be awaited before using its value"
 * - "sync-dynamic-apis"
 */
export async function getServerSession() {
  try {
    // Temporarily suppress console.error for NextAuth warnings
    const originalError = console.error
    console.error = (...args) => {
      const message = args[0]
      // Only suppress the specific NextAuth.js + Next.js 15 compatibility warnings
      if (
        typeof message === 'string' &&
        (message.includes('`headers()` should be awaited before using its value') ||
          message.includes('sync-dynamic-apis'))
      ) {
        return // Suppress these warnings
      }
      originalError.apply(console, args)
    }

    const session = await auth()

    // Restore original console.error
    console.error = originalError

    return session
  } catch (error) {
    console.error("Error getting server session:", error)
    return null
  }
}
