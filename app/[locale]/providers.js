"use client";
import { useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import useLoyaltyStore from "../_modules/loyalty/store/loyaltyStore";
import useAuthStore from "../_modules/auth/store/authStore";

function LoyaltyInitializer() {
    const { data: session, status } = useSession();
    const { setUser, setSession, clearUser } = useAuthStore();
    const { fetchConfig, fetchTier, fetchBalance } = useLoyaltyStore();

    useEffect(() => {
        if (status !== "authenticated" || !session?.user?.id) {
            if (status === "unauthenticated") {
                clearUser();
            }
            return;
        }

        let cancelled = false;

        const init = async () => {
            setUser(session.user);
            setSession(session);

            const config = await fetchConfig();
            if (!config || cancelled) return;

            await Promise.all([
                fetchTier(session.user.id),
                fetchBalance(session.user.id),
            ]);
        };

        init();

        return () => {
            cancelled = true;
        };
    }, [status, session?.user?.id]);

    return null;
}

export function AuthProvider({ children }) {
    return (
        <SessionProvider>
            <LoyaltyInitializer />
            {children}
        </SessionProvider>
    );
}
