import { NextResponse } from "next/server";
import { hotelService } from "@/app/_modules/hotels/services/hotelService";

export async function POST(request) {
    try {
        const body = await request.json();
        const { pnr_no, booking_no } = body;

        console.log("[Hotel BookingDetails] Request body:", { pnr_no, booking_no });

        if (!pnr_no && !booking_no) {
            return NextResponse.json(
                { success: false, error: "pnr_no or booking_no is required" },
                { status: 400 }
            );
        }

        const payload = {};
        if (pnr_no) payload.pnr_no = pnr_no;
        if (booking_no) payload.booking_no = booking_no;

        const requestId = `hotel-details-${Date.now()}`;
        const result = await hotelService.getBookingDetails(payload, requestId);

        console.log("[Hotel BookingDetails] Raw API result keys:", Object.keys(result || {}));
        console.log("[Hotel BookingDetails] Raw API result:", JSON.stringify(result).substring(0, 1000));

        // The external API returns { booking_list: [...] } or the data directly
        const bookingList = result?.booking_list || result?.response?.booking_list || result;

        return NextResponse.json({
            success: true,
            data: bookingList,
        });
    } catch (error) {
        console.error("Hotel BookingDetails API error:", error.message);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

