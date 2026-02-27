"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Hook for hotel details and rooms availability.
 * Accepts SSR-provided initial data to avoid double-fetching.
 * Only re-fetches rooms when search params change after initial load.
 */
export default function useHotelDetails(
    hotelId,
    initialHotelDetails = null,
    initialRooms = null
) {
    const searchParams = useSearchParams();
    const [hotelDetails, setHotelDetails] = useState(initialHotelDetails);
    const [rooms, setRooms] = useState(initialRooms || []);
    const [loading, setLoading] = useState(!initialHotelDetails);
    const [roomsLoading, setRoomsLoading] = useState(!initialRooms);
    const [error, setError] = useState(null);
    const [searchPayload, setSearchPayload] = useState(
        initialRooms?.SearchPayLoad?.encodedSearch || null
    );

    // Get search params
    const params = useMemo(
        () => ({
            checkIn: searchParams.get("checkIn"),
            checkOut: searchParams.get("checkOut"),
            nationality: searchParams.get("nationality") || "AE",
            roomDetails: searchParams.get("roomDetails"),
            adults: parseInt(searchParams.get("adults")) || 2,
        }),
        [searchParams]
    );

    // Calculate nights
    const nights = useMemo(() => {
        if (!params.checkIn || !params.checkOut) return 1;
        const diffMs =
            new Date(params.checkOut) - new Date(params.checkIn);
        return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    }, [params.checkIn, params.checkOut]);

    // Parse room details — stabilize with JSON string key
    const roomDetailsStr = params.roomDetails || "";
    const roomsConfig = useMemo(() => {
        if (roomDetailsStr) {
            try {
                return JSON.parse(roomDetailsStr);
            } catch (e) {
                return [{ adults: params.adults }];
            }
        }
        return [{ adults: params.adults }];
    }, [roomDetailsStr, params.adults]);

    // Serialize the rooms fetch parameters for stable dependency tracking
    const roomsFetchKey = useMemo(() => {
        if (!hotelId || !params.checkIn || !params.checkOut) return null;
        return JSON.stringify({
            hotel_id: hotelId,
            check_in: params.checkIn,
            check_out: params.checkOut,
            nationality: params.nationality,
            rooms: roomsConfig,
        });
    }, [hotelId, params.checkIn, params.checkOut, params.nationality, roomsConfig]);

    // Track the fetch key that was used for initial SSR data
    const initialFetchKey = useRef(initialRooms ? roomsFetchKey : null);

    // Fetch hotel details — SKIP if SSR data provided
    useEffect(() => {
        if (!hotelId || initialHotelDetails) return;

        async function fetchDetails() {
            try {
                setLoading(true);
                const response = await fetch("/api/hotel/details", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ hotel_id: hotelId }),
                });

                const result = await response.json();
                if (result.success) {
                    setHotelDetails(result.data);
                } else {
                    setError(
                        result.error || "Failed to load hotel details"
                    );
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchDetails();
    }, [hotelId, initialHotelDetails]);

    // Fetch rooms — SKIP if same params as SSR data, re-fetch only on param change
    useEffect(() => {
        if (!roomsFetchKey) {
            setRoomsLoading(false);
            return;
        }

        // Skip if these are the same params that SSR already fetched
        if (initialFetchKey.current === roomsFetchKey) {
            setRoomsLoading(false);
            return;
        }

        // Once we've moved past initial data, clear the ref
        initialFetchKey.current = null;

        let cancelled = false;

        async function fetchRooms() {
            try {
                setRoomsLoading(true);
                const response = await fetch("/api/hotel/rooms", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: roomsFetchKey, // Already a JSON string
                });

                const result = await response.json();

                if (!cancelled && result.success) {
                    setRooms(
                        result.data?.RoomsAvailibility || result.data || []
                    );
                    setSearchPayload(
                        result.data?.SearchPayLoad?.encodedSearch
                    );
                }
            } catch (err) {
                console.error("Error fetching rooms:", err);
            } finally {
                if (!cancelled) setRoomsLoading(false);
            }
        }

        fetchRooms();

        return () => { cancelled = true; };
    }, [roomsFetchKey]);

    // Extract flat rooms array from API response
    const hotelRooms = useMemo(() => {
        return rooms?.HotelRooms || (Array.isArray(rooms) ? rooms : []);
    }, [rooms]);

    return {
        hotelDetails,
        rooms,
        hotelRooms,
        loading,
        roomsLoading,
        error,
        searchParams: { ...params, nights },
        searchPayload,
    };
}
