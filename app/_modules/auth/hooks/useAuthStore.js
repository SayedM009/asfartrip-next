"use client";

import useAuthStoreBase from "../store/authStore";

/**
 * Zustand auth store hook for fast synchronous reads.
 * IMPORTANT: Do NOT use this for auth decisions - use useSession() from NextAuth.
 * This store contains read-only snapshots that are synced after session resolution.
 */
export function useAuthStore() {
    const state = useAuthStoreBase();
    return state;
}
