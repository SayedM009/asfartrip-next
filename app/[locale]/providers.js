"use client";
import { useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import useAuthStore from "@/app/_store/authStore";
import useLoyaltyStore from "@/app/_store/loyaltyStore";

function LoyaltyInitializer() {
    const { data: session, status } = useSession();
    const { setUser, setSession, clearUser } = useAuthStore();
    const { fetchConfig, fetchTier, fetchBalance } = useLoyaltyStore();

    useEffect(() => {
        if (status === "authenticated" && session?.user?.id) {
            setUser(session.user);
            setSession(session);
            Promise.all([
                fetchConfig(),
                fetchTier(session.user.id),
                fetchBalance(session.user.id),
            ]);
        } else if (status === "unauthenticated") {
            clearUser();
        }
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
