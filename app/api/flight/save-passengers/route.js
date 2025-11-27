import { NextResponse } from "next/server";
import { flightService } from "@/app/_services/flight-service";

export async function POST(req) {
    const requestId = `SAVE_${Date.now()}`;
    console.log(`[${requestId}]  Received save-passengers request`);

    try {
        const bodyText = await req.text();
        const params = Object.fromEntries(new URLSearchParams(bodyText));

        console.log(`[${requestId}]  Parsed params:`, {
            session_id: params.session_id,
            temp_id: params.temp_id,
            amount: params.amount,
            hasTravelerDetails: !!params.TravelerDetails,
        });

        // Basic validation
        if (!params.TravelerDetails) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "TravelerDetails is required",
                },
                { status: 400 }
            );
        }

        // Use FlightService to save passengers
        const data = await flightService.savePassengers(params, requestId);

        console.log(`[${requestId}]  Save successful:`, {
            booking_reference: data.booking_reference,
            gateway: data.gateway?.name || "N/A",
        });

        return NextResponse.json(data);

    } catch (error) {
        console.error(`[${requestId}]  Save Passengers Error:`, error.message);
        return NextResponse.json(
            {
                status: "error",
                message: error.message || "An unexpected error occurred",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
