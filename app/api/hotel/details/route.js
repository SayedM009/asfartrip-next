import { NextResponse } from "next/server";
import { hotelService } from "@/app/_modules/hotels/services/hotelService";

/**
 * POST /api/hotel/details
 * Get hotel details
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { hotel_id } = body;

        if (!hotel_id) {
            return NextResponse.json(
                { error: "hotel_id is required" },
                { status: 400 }
            );
        }

        const result = await hotelService.getHotelDetails(hotel_id, `details-${hotel_id}`);

        if (result.status !== "Success" || !result.response?.HotelDetails) {
            return NextResponse.json(
                { success: false, error: "Hotel not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.response.HotelDetails,
        });
    } catch (error) {
        console.error("[Hotel Details API Error]:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
