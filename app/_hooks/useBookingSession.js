"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook to manage booking session data
 * Stores session_id and temp_id in sessionStorage
 */
export function useBookingSession() {
    const [sessionData, setSessionData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load session data from sessionStorage on mount
        try {
            const stored = sessionStorage.getItem("booking_session");
            if (stored) {
                const parsed = JSON.parse(stored);
                setSessionData(parsed);
            }
        } catch (error) {
            console.error("Failed to load session data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Store booking session data
     */
    const storeSession = (data) => {
        try {
            const sessionInfo = {
                sessionId: data.sessionId,
                tempId: data.tempId,
                basePrice: data.basePrice,
                taxPrice: data.taxPrice,
                totalPrice: data.totalPrice,
                currency: data.currency,
                timestamp: Date.now(),
                expiresAt: Date.now() + 30 * 60 * 1000, // 30 minutes
            };

            sessionStorage.setItem(
                "booking_session",
                JSON.stringify(sessionInfo)
            );
            setSessionData(sessionInfo);

            console.log("✅ Session data stored:", sessionInfo);
            return true;
        } catch (error) {
            console.error("❌ Failed to store session data:", error);
            return false;
        }
    };

    /**
     * Clear booking session data
     */
    const clearSession = () => {
        try {
            sessionStorage.removeItem("booking_session");
            setSessionData(null);
            console.log("🗑️ Session data cleared");
            return true;
        } catch (error) {
            console.error("❌ Failed to clear session data:", error);
            return false;
        }
    };

    /**
     * Check if session is expired
     */
    const isSessionExpired = () => {
        if (!sessionData || !sessionData.expiresAt) {
            return true;
        }
        return Date.now() > sessionData.expiresAt;
    };

    /**
     * Get session data if valid, otherwise clear
     */
    const getValidSession = () => {
        if (!sessionData) {
            return null;
        }

        if (isSessionExpired()) {
            console.warn("⚠️ Session expired, clearing...");
            clearSession();
            return null;
        }

        return sessionData;
    };

    return {
        sessionData,
        isLoading,
        storeSession,
        clearSession,
        isSessionExpired,
        getValidSession,
    };
}
