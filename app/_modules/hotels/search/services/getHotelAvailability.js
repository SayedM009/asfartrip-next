import { headers } from "next/headers";

export async function getHotelAvailability({
    city,
    checkIn,
    checkOut,
    nationality = "AE",
    roomDetails,
    currency = "AED",
    locationId,
    hotelId,
}) {



    const host = (await headers()).get('host');

    const protocol = host.includes('localhost') ? 'http' : 'https';

    const baseUrl = `${protocol}://${host}`;
    try {
        // Parse room details if string
        const rooms = typeof roomDetails === "string"
            ? JSON.parse(roomDetails)
            : roomDetails;

        // Build request body
        const body = {
            city,
            checkIn,
            checkOut,
            nationality,
            currency,
            rooms: rooms.map((room) => ({
                adults: room.adults || 1,
                childrenAges: room.childrenAges || [],
            })),
        };

        // Add locationId or hotelId
        if (hotelId) {
            body.hotelId = hotelId;
        } else if (locationId) {
            body.locationId = locationId;
        }

        // Call the API route
        const response = await fetch(`${baseUrl}/api/hotel/availability`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            cache: "no-store",
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to get hotel availability");
        }

        const result = await response.json()

        return {
            success: result.success,
            data: result.data,
            searchParams: result.searchParams,
            SearchPayLoad: result.SearchPayLoad,
        };
    } catch (error) {
        console.error("[getHotelAvailability Error]:", error);
        return {
            success: false,
            error: error.message,
            data: null,
        };
    }
}
