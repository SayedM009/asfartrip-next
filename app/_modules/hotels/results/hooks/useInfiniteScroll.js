"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Hook for infinite scroll functionality using IntersectionObserver
 * @param {Object} options - Hook options
 * @param {number} options.threshold - Intersection threshold (0-1)
 * @param {string} options.rootMargin - Root margin for intersection
 * @returns {Object} - { ref, inView, reset }
 */
export function useInfiniteScroll({
    threshold = 0.1,
    rootMargin = "100px",
} = {}) {
    const [inView, setInView] = useState(false);
    const ref = useRef(null);
    const observerRef = useRef(null);

    const reset = useCallback(() => {
        setInView(false);
    }, []);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // Disconnect previous observer
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // Create new observer
        observerRef.current = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                setInView(entry.isIntersecting);
            },
            {
                threshold,
                rootMargin,
            }
        );

        observerRef.current.observe(element);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [threshold, rootMargin]);

    return { ref, inView, reset };
}
