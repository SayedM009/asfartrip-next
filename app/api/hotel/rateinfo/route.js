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

        // Check for API-level errors (e.g. "Search Session has expired")
        const response = result?.response || result;
        if (response?.status === "Error" || response?.error) {
            const errMsg = response?.error?.message || response?.error || "Rate info request failed";
            const isSessionExpired = response?.error?.code === "04" || errMsg.toLowerCase().includes("session");
            return NextResponse.json(
                { success: false, error: errMsg, sessionExpired: isSessionExpired },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: true, data: response });
    } catch (error) {
        console.error("RateInfo API error:", error.message);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
