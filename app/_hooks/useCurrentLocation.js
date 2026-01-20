"use client";
import { useState, useCallback } from "react";

/**
 * Custom hook for getting user's current location and city name
 * Uses browser Geolocation API and OpenStreetMap Nominatim for reverse geocoding
 */
export default function useCurrentLocation() {
    const [city, setCity] = useState(null);
    const [country, setCountry] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [permissionDenied, setPermissionDenied] = useState(false);

    const getCurrentLocation = useCallback(async () => {
        // Reset states
        setIsLoading(true);
        setError(null);
        setCity(null);
        setPermissionDenied(false);

        // Check if geolocation is supported
        if (!navigator.geolocation) {
            setError("geolocation_not_supported");
            setIsLoading(false);
            return;
        }

        try {
            // Get current position
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: false,
                    timeout: 10000,
                    maximumAge: 300000, // Cache for 5 minutes
                });
            });

            const { latitude, longitude } = position.coords;

            // Reverse geocoding using OpenStreetMap Nominatim (free, no API key needed)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
                {
                    headers: {
                        "Accept-Language": "en", // Get English names
                    },
                }
            );

            if (!response.ok) {
                throw new Error("geocoding_failed");
            }

            const data = await response.json();


            // Extract city name (try different fields)
            const cityName =
                data.address?.city ||
                data.address?.town ||
                data.address?.municipality ||
                data.address?.county ||
                data.address?.state ||
                null;

            if (cityName) {
                setCity(cityName);
            } else {
                setError("city_not_found");
            }

            // Extract country name
            const countryName = data.address?.country || null;
            if (countryName) {
                setCountry(countryName);
            }
        } catch (err) {
            console.error("Location error:", err);

            if (err.code === 1) {
                // Permission denied
                setPermissionDenied(true);
                setError("permission_denied");
            } else if (err.code === 2) {
                setError("position_unavailable");
            } else if (err.code === 3) {
                setError("timeout");
            } else {
                setError("unknown_error");
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setCity(null);
        setError(null);
        setPermissionDenied(false);
        setIsLoading(false);
    }, []);

    return {
        city,
        country,
        isLoading,
        error,
        permissionDenied,
        getCurrentLocation,
        reset,
    };
}
