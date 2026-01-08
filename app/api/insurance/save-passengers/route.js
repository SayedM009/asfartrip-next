import { NextResponse } from "next/server";
import { insuranceService } from "@/app/_services/insurance-service";

export async function POST(req) {
    const requestId = `INS_SAVE_${Date.now()}`;
    console.log(`[${requestId}] Received insurance save-passengers request`);

    try {
        const bodyText = await req.text();
        const params = Object.fromEntries(new URLSearchParams(bodyText));

        console.log(`[${requestId}] Parsed params:`, {
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

        if (!params.session_id) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "session_id is required",
                },
                { status: 400 }
            );
        }

        // Use InsuranceService to save passengers
        const data = await insuranceService.savePassengers(params, requestId);

        console.log(`[${requestId}] Save successful:`, {
            booking_reference: data.booking_reference || data.order_id,
            gateway: data.gateway?.name || "N/A",
        });

        // Normalize response to match expected format
        return NextResponse.json({
            status: data.status || "success",
            booking_reference: data.booking_reference || data.order_id || data.data?.order_id,
            gateway: data.gateway || data.data?.gateway,
            message: data.message,
        });

    } catch (error) {
        console.error(`[${requestId}] Save Passengers Error:`, error.message);
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
