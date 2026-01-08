"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect if mobile keyboard is visible
 * Uses visualViewport API to detect viewport resize caused by keyboard
 * Returns true when keyboard is open (viewport is smaller than window)
 */
export function useKeyboardVisible() {
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    useEffect(() => {
        // Only run on client side
        if (typeof window === "undefined") return;

        const visualViewport = window.visualViewport;
        if (!visualViewport) return;

        const handleResize = () => {
            // If visual viewport height is significantly smaller than window height,
            // keyboard is likely open
            const heightDiff = window.innerHeight - visualViewport.height;
            setIsKeyboardVisible(heightDiff > 150); // 150px threshold for keyboard
        };

        visualViewport.addEventListener("resize", handleResize);
        visualViewport.addEventListener("scroll", handleResize);

        // Initial check
        handleResize();

        return () => {
            visualViewport.removeEventListener("resize", handleResize);
            visualViewport.removeEventListener("scroll", handleResize);
        };
    }, []);

    return isKeyboardVisible;
}
