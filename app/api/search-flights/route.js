import { NextResponse } from "next/server";
import { searchFlights } from "@/app/_libs/flightService";

export async function POST(req) {
    try {
        const params = await req.json();
        const data = await searchFlights(params);
        return NextResponse.json(data);
    } catch (err) {
        console.error("SearchFlights API error:", err);
        return NextResponse.json(
            { error: "Failed to search" },
            { status: 500 }
        );
    }
}
