import { NextResponse } from "next/server";
import { hotelService } from "@/app/_modules/hotels/services/hotelService";

export async function POST(request) {
    try {
        const body = await request.json();
        const { RoomLoad, SearchPayLoad } = body;

        if (!RoomLoad || !SearchPayLoad) {
            return NextResponse.json(
                { success: false, error: "RoomLoad and SearchPayLoad are required" },
                { status: 400 }
            );
        }

        const requestId = `rateinfo-${Date.now()}`;
        const result = await hotelService.getRateInfo(
            { RoomLoad, SearchPayLoad },
            requestId
        );

        return NextResponse.json({ success: true, data: result?.response || result });
    } catch (error) {
        console.error("RateInfo API error:", error.message);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
