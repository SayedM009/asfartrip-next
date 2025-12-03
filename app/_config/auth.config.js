// ============================================
// auth.config.js - EDGE-SAFE CONFIGURATION
// ============================================
// This file is imported by middleware.js
// Must be 100% Edge Runtime compatible
// NO fetch calls, NO heavy providers, NO Node.js APIs

export const authConfig = {
    pages: {
        signIn: '/',
    },

    // Must be empty array for Edge compatibility
    providers: [],

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    secret: process.env.NEXTAUTH_SECRET,
    trustHost: true,

    callbacks: {
        // ✅ ONLY callback safe for Edge Runtime
        // This runs in middleware to check if user can access protected routes
        authorized({ auth, request }) {
            const { nextUrl } = request;
            const isLoggedIn = !!auth?.user;
            const isProtected = nextUrl.pathname.includes('/profile');

            if (isProtected) {
                return isLoggedIn; // Redirect to login if not logged in
            }

            return true; // Allow access to public routes
        },

        // ❌ REMOVED: signIn, jwt, session callbacks
        // Those belong in auth.js (Node runtime only)
    },
};