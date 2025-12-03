

export const authConfig = {
    pages: {
        signIn: '/',
    },

    providers: [],

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },

    secret: process.env.NEXTAUTH_SECRET,
    trustHost: true,

    callbacks: {

        authorized({ auth, request }) {
            const { nextUrl } = request;
            const isLoggedIn = !!auth?.user;
            const isProtected = nextUrl.pathname.includes('/profile');

            if (isProtected) {
                return isLoggedIn;
            }

            return true;
        },


    },
};