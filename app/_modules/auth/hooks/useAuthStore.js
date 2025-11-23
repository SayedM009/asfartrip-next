"use client";

import useAuthStoreBase from "../store/authStore";

export function useAuthStore() {
    const state = useAuthStoreBase();
    return {
        ...state,
        isAuthenticated: state.status === "authenticated",
        isLoading: state.status === "loading",
    };
}
