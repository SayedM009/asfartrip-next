import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create(
    persist(
        (set, get) => ({
            // Read-only snapshots - NOT authoritative for auth decisions
            // These are synced from LoyaltyInitializer AFTER useSession() resolves
            user: null,
            session: null,

            // Called only from LoyaltyInitializer after NextAuth session resolves
            setUser: (user) => set({ user }),

            setSession: (session) => set({ session }),

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
                set({ user: null, session: null });
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
            // CRITICAL: Skip hydration to prevent stale auth data on first render
            // Zustand state is synced only after useSession() resolves in LoyaltyInitializer
            skipHydration: true,
        }
    )
);

export default useAuthStore;
