import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            status: "loading",
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

            updateSessionUser: (userData) => {
                const currentSession = get().session;

                if (!currentSession) return;

                set({
                    session: {
                        ...currentSession,
                        fullData: {
                            ...currentSession.fullData,
                            user: userData,
                        },
                    },
                });
            },
            updateUser: (userData) => {
                const currentUser = get().user;

                if (!currentUser) return;

                set({
                    user: {
                        ...currentUser,
                        ...userData,
                    },
                });
            },

            clearUser: () => {
                set({ user: null, status: "unauthenticated", session: null });
                import("@/app/_modules/loyalty/store/loyaltyStore").then(
                    (mod) => mod.default.getState().reset()
                );
            },
        }),
        {
            name: "auth-store",
            storage: createJSONStorage(() => {
                if (typeof window !== "undefined") {
                    return window.localStorage;
                }
                return {
                    getItem: () => null,
                    setItem: () => { },
                    removeItem: () => { },
                };
            }),
        }
    )
);

export default useAuthStore;
