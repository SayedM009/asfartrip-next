import { NextResponse } from "next/server";
import { flightService } from "@/app/_services/flight-service";

export async function POST(req) {
    const requestId = `GET_BOOKING_${Date.now()}`;
    try {
        const { booking_reference } = await req.json();
        if (!booking_reference) throw new Error("Missing booking_reference");

        const data = await flightService.getBooking({ booking_reference }, requestId);
        return NextResponse.json(data);
    } catch (err) {
        console.error(`[${requestId}]`, err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
