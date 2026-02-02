import { NextResponse } from "next/server";
import { hotelService } from "@/app/_modules/hotels/services/hotelService";

/**
 * POST /api/hotel/rooms
 * Get rooms availability for a hotel
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { hotel_id, check_in, check_out, nationality, rooms } = body;

        // Validation
        if (!hotel_id || !check_in || !check_out || !rooms) {
            return NextResponse.json(
                { error: "Missing required fields: hotel_id, check_in, check_out, rooms" },
                { status: 400 }
            );
        }

        const result = await hotelService.getRoomsAvailability({
            hotel_id,
            check_in,
            check_out,
            nationality: nationality || "AE",
            rooms,
        }, `rooms-${hotel_id}`);

        if (result.status !== "Success") {
            return NextResponse.json(
                { success: false, error: result.message || "No rooms available" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.response,
        });
    } catch (error) {
        console.error("[Rooms Availability API Error]:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
