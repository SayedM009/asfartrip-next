import { useState, useEffect, useRef } from "react";
import { safeParse } from "@/app/_helpers/safeParse";

export function useSessionPersistence(key, defaultValue) {
    // Use ref to store the default value to avoid infinite loops
    const defaultValueRef = useRef(defaultValue);
    const [value, setValue] = useState(defaultValue);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Load from session storage on mount
        const storedValue = sessionStorage.getItem(key);
        if (storedValue) {
            setValue(safeParse(storedValue, defaultValueRef.current));
        }
        setIsInitialized(true);
    }, [key]); // Removed defaultValue from dependencies

    const setPersistedValue = (newValue) => {
        setValue(newValue);
        // Save to session storage
        if (newValue === null || newValue === undefined) {
            sessionStorage.removeItem(key);
        } else {
            // ✅ FIXED: Always stringify ALL values (including strings) for consistent parsing
            sessionStorage.setItem(key, JSON.stringify(newValue));
        }
    };

    return [value, setPersistedValue, isInitialized];
}
