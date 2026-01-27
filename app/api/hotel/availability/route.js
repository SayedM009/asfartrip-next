import { NextResponse } from "next/server";
import { hotelService } from "@/app/_modules/hotels/services/hotelService";

/**
 * POST /api/hotel/availability
 * Get hotel availability
 * 
 * Request body: {
 *   city: string,
 *   checkIn: string (yyyy-MM-dd),
 *   checkOut: string (yyyy-MM-dd),
 *   nationality: string (country code),
 *   rooms: [{ adults: number, childrenAges: number[] }],
 *   currency: string,
 *   locationId?: string,
 *   hotelId?: string
 * }
 */
export async function POST(request) {
    try {
        const body = await request.json();

        const {
            city,
            checkIn,
            checkOut,
            nationality,
            rooms,
            currency = "AED",
            locationId,
            hotelId,
        } = body;

        // Validation
        if (!city || !checkIn || !checkOut || !nationality || !rooms) {
            return NextResponse.json(
                { error: "Missing required fields: city, checkIn, checkOut, nationality, rooms" },
                { status: 400 }
            );
        }

        if (!locationId && !hotelId) {
            return NextResponse.json(
                { error: "Either locationId or hotelId is required" },
                { status: 400 }
            );
        }

        if (!Array.isArray(rooms) || rooms.length === 0) {
            return NextResponse.json(
                { error: "rooms must be a non-empty array" },
                { status: 400 }
            );
        }

        // Calculate totals
        const totalAdults = rooms.reduce((sum, room) => sum + (room.adults || 1), 0);
        const totalChildren = rooms.reduce((sum, room) => sum + (room.childrenAges?.length || 0), 0);
        const allChildAges = rooms.flatMap((room) => room.childrenAges || []);

        // Build payload matching old API format
        const payload = {
            city,
            check_in: checkIn,
            check_out: checkOut,
            nationality,
            currency,
            adults: totalAdults,
            children: totalChildren,
            childAges: allChildAges,
            // Format rooms for API: { adults: number, childs: number[] }
            rooms: rooms.map((room) => ({
                adults: room.adults || 1,
                childs: room.childrenAges || [],
            })),
        };

        // Add location_id or hotel_id
        if (hotelId) {
            payload.hotel_id = hotelId;
        } else if (locationId) {
            payload.location_id = locationId;
        }

        const requestId = `hotel-availability-${Date.now()}`;
        const data = await hotelService.getHotelAvailability(payload, requestId);

        // Check if response is successful
        if (data.status !== "Success") {
            return NextResponse.json(
                { error: data.message || "Failed to get hotel availability" },
                { status: 500 }
            );
        }

        // Return the availability data
        const availability = data.response?.HotelsAvailibility || null;
        const SearchPayLoad = data.response?.SearchPayLoad || null;


        return NextResponse.json({
            success: true,
            data: availability,
            searchParams: {
                city,
                checkIn,
                checkOut,
                rooms: rooms.length,
                adults: totalAdults,
                children: totalChildren,
            },
            SearchPayLoad
        });
    } catch (error) {
        console.error("[Hotel Availability API Error]:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
