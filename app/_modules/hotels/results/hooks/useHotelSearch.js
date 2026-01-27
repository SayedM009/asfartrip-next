"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Client-side hotel availability fetch
 */
async function fetchHotelAvailability(params) {
    const body = {
        city: params.destination,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        nationality: params.nationality || "AE",
        currency: "AED",
        rooms: params.rooms,
    };

    // Add locationId or hotelId
    if (params.hotelId) {
        body.hotelId = params.hotelId;
    } else if (params.locationId) {
        body.locationId = params.locationId;
    }

    const response = await fetch("/api/hotel/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to get hotel availability");
    }

    return response.json();
}

/**
 * Hook for client-side hotel search with loading state
 * Watches URL params and refetches when they change
 */
export default function useHotelSearch() {
    const searchParams = useSearchParams();
    const [hotels, setHotels] = useState([]);
    const [searchPayload, setSearchPayload] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);
    const isMountedRef = useRef(true);

    // Create stable params object from URL
    const params = useMemo(() => {
        const destination = searchParams.get("destination");
        const checkIn = searchParams.get("checkIn");
        const checkOut = searchParams.get("checkOut");
        const nationality = searchParams.get("nationality") || "AE";
        const roomDetails = searchParams.get("roomDetails");
        const locationId = searchParams.get("locationId");
        const hotelId = searchParams.get("hotelId");

        // Parse room details
        let rooms = [{ adults: 2, childrenAges: [] }];
        if (roomDetails) {
            try {
                rooms = JSON.parse(roomDetails);
            } catch (e) {
                console.error("Error parsing roomDetails:", e);
            }
        }

        return {
            destination,
            checkIn,
            checkOut,
            nationality,
            rooms,
            locationId,
            hotelId,
            nights: parseInt(searchParams.get("nights")) || 1,
            roomCount: parseInt(searchParams.get("rooms")) || 1,
            adults: parseInt(searchParams.get("adults")) || 2,
        };
    }, [searchParams]);

    // Create a stable key for the search params to detect changes
    const paramsKey = useMemo(() => {
        return JSON.stringify({
            destination: params.destination,
            checkIn: params.checkIn,
            checkOut: params.checkOut,
            locationId: params.locationId,
            hotelId: params.hotelId,
            rooms: params.rooms,
        });
    }, [params]);

    useEffect(() => {
        isMountedRef.current = true;

        // Validate required params
        if (!params.destination || !params.checkIn || !params.checkOut ||
            (!params.locationId && !params.hotelId)) {
            setError({ message: "Missing required search parameters", type: "VALIDATION_ERROR" });
            setLoading(false);
            return;
        }

        async function load() {
            // Abort previous request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();

            // Reset state - clear old results immediately
            setLoading(true);
            setError(null);
            setHotels([]);
            setSearchPayload({});

            try {
                const result = await fetchHotelAvailability(params);

                if (!isMountedRef.current) return;

                if (!result.success) {
                    setError({ message: result.error || "Failed to fetch hotels", type: "API_ERROR" });
                    setLoading(false);
                    return;
                }

                setHotels(result.data || []);
                setSearchPayload(result.SearchPayLoad || {});
                setLoading(false);
            } catch (err) {
                if (!isMountedRef.current || err.name === "AbortError") return;
                setError({ message: err.message || "Network error", type: "NETWORK_ERROR" });
                setLoading(false);
            }
        }

        load();

        return () => {
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [paramsKey]); // Only re-run when params actually change

    return {
        hotels,
        searchPayload,
        loading,
        error,
        searchParams: {
            ...params,
            city: params.destination,
        },
    };
}
