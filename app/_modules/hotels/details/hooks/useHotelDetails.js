"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Hook for fetching hotel details and rooms availability
 */
export default function useHotelDetails(hotelId) {
    const searchParams = useSearchParams();
    const [hotelDetails, setHotelDetails] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roomsLoading, setRoomsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get search params
    const params = useMemo(() => ({
        checkIn: searchParams.get("checkIn"),
        checkOut: searchParams.get("checkOut"),
        nationality: searchParams.get("nationality") || "AE",
        roomDetails: searchParams.get("roomDetails"),
        adults: parseInt(searchParams.get("adults")) || 2,
    }), [searchParams]);

    // Parse room details
    const roomsConfig = useMemo(() => {
        if (params.roomDetails) {
            try {
                return JSON.parse(params.roomDetails);
            } catch (e) {
                return [{ adults: params.adults }];
            }
        }
        return [{ adults: params.adults }];
    }, [params.roomDetails, params.adults]);

    // Fetch hotel details
    useEffect(() => {
        if (!hotelId) return;

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
                    setError(result.error || "Failed to load hotel details");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchDetails();
    }, [hotelId]);

    // Fetch rooms availability
    useEffect(() => {
        if (!hotelId || !params.checkIn || !params.checkOut) {
            setRoomsLoading(false);
            return;
        }

        async function fetchRooms() {
            try {
                setRoomsLoading(true);
                const response = await fetch("/api/hotel/rooms", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        hotel_id: hotelId,
                        check_in: params.checkIn,
                        check_out: params.checkOut,
                        nationality: params.nationality,
                        rooms: roomsConfig,
                    }),
                });

                const result = await response.json();
                if (result.success) {
                    setRooms(result.data?.RoomsAvailibility || []);
                }
            } catch (err) {
                console.error("Error fetching rooms:", err);
            } finally {
                setRoomsLoading(false);
            }
        }

        fetchRooms();
    }, [hotelId, params.checkIn, params.checkOut, params.nationality, roomsConfig]);

    return {
        hotelDetails,
        rooms,
        loading,
        roomsLoading,
        error,
        searchParams: params,
    };
}
