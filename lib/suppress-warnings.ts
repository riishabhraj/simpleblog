// Suppress NextAuth.js v5 + Next.js 15 compatibility warnings
// This is a temporary solution until NextAuth.js fully supports Next.js 15

const originalConsoleError = console.error;

console.error = (...args) => {
    // Filter out specific NextAuth.js warnings that don't affect functionality
    const message = args[0];
    if (
        typeof message === 'string' &&
        (message.includes('`headers()` should be awaited before using its value') ||
            message.includes('sync-dynamic-apis'))
    ) {
        return; // Suppress these specific warnings
    }

    // Log all other errors normally
    originalConsoleError.apply(console, args);
};

export { };
