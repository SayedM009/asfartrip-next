import { NextResponse } from "next/server";
import { hotelService } from "@/app/_modules/hotels/services/hotelService";

/**
 * POST /api/hotel/search
 * Search for hotels and locations by term
 * 
 * Request body: { term: string }
 * Response: { locations: [], hotels: [] }
 */
export async function POST(request) {
    try {
        const { term } = await request.json();

        if (!term || term.trim().length < 2) {
            return NextResponse.json(
                { error: "Search term must be at least 2 characters" },
                { status: 400 }
            );
        }

        const requestId = `hotel-search-${Date.now()}`;
        const data = await hotelService.searchHotelTerm(term.trim(), requestId);

        // Check if response is successful
        if (data.status !== "Success") {
            return NextResponse.json(
                { error: "Failed to search hotels" },
                { status: 500 }
            );
        }

        // Extract and format the response
        const searchResults = data.response?.SearchHotelTerm || {};
        const locations = searchResults.Location || [];
        const hotels = searchResults.Hotels || [];

        return NextResponse.json({
            locations: locations.map((loc) => ({
                id: loc.location_id,
                name: loc.location_name,
                country: loc.country_name,
                countryCode: loc.country_code,
                type: "location",
            })),
            hotels: hotels.map((hotel) => ({
                id: hotel.hotel_id,
                name: hotel.hotel_name,
                location: hotel.location_name,
                country: hotel.country_name,
                countryCode: hotel.country_code,
                type: "hotel",
            })),
        });
    } catch (error) {
        console.error("[Hotel Search API Error]:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
