import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            status: "loading", // "loading" | "authenticated" | "unauthenticated"
            session: null,

            setUser: (user) =>
                set({
                    user,
                    status: user ? "authenticated" : "unauthenticated",
                }),

            setSession: (session) =>
                set({
                    session: session,
                }),

            clearUser: () => {
                set({ user: null, status: "unauthenticated", session: null });
                import("@/app/_store/loyaltyStore").then((mod) =>
                    mod.default.getState().reset()
                );
            },
        }),
        { name: "auth-store" }
    )
);

export default useAuthStore;
