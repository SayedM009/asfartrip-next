import { NextResponse } from "next/server";
import { hotelService } from "@/app/_modules/hotels/services/hotelService";

/**
 * GET /api/hotel/recommended
 * Get recommended hotels for a city
 * 
 * Query params: city, country
 * Response: { success: boolean, data: Hotel[] }
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const city = searchParams.get("city");
        const country = searchParams.get("country");

        if (!city || !country) {
            return NextResponse.json(
                { error: "city and country are required" },
                { status: 400 }
            );
        }

        const requestId = `recommended-hotels-${Date.now()}`;
        const data = await hotelService.getRecommendedHotels(city, country, requestId);

        // Check if response is successful - handle case-insensitive status
        const status = (data.status || data.Status || "").toLowerCase();
        if (status !== "success") {
            return NextResponse.json(
                { error: data.message || data.Message || "Failed to get recommended hotels" },
                { status: 500 }
            );
        }

        // Extract hotels - API returns { status: "success", data: [...] }
        const hotels = data.data || data.Data || [];

        return NextResponse.json({
            success: true,
            data: hotels.map((hotel) => ({
                id: hotel.id,
                name: hotel.name,
                image: hotel.thumb_image || hotel.image_path,
                rating: parseInt(hotel.star_rating) || 0,
                reviewScore: parseFloat(hotel.ta_rating) || 0,
                address: hotel.address,
                city: hotel.city_name,
                country: hotel.country,
                countryCode: hotel.country_code,
            })),
        });
    } catch (error) {
        console.error("[Recommended Hotels API Error]:", error.message);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
