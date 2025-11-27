import { NextResponse } from "next/server";
import { flightService } from "@/app/_services/flight-service";

export async function POST(req) {
    const requestId = `CART_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

    try {
        const payload = await req.json();
        const sessionId = payload.session_id;

        if (!sessionId) {
            return NextResponse.json(
                { error: "session_id is required" },
                { status: 400 }
            );
        }

        // SIMULATION: Handle Simulated Session
        if (sessionId === "SIMULATED_SESSION") {
            console.log(` [${new Date().toISOString()}] [${requestId}] Returning Simulated Cart`);
            return NextResponse.json({
                status: "success",
                data: {
                    Status: "Success",
                    Message: null,
                    CartId: "SIMULATED_CART_ID",
                    TotalPrice: 150,
                    Currency: "SAR",
                    Passengers: [
                        {
                            Type: "Adult",
                            Quantity: 1,
                            BasePrice: 120,
                            TaxPrice: 30,
                            TotalPrice: 150
                        }
                    ],
                    Segments: [] // Add dummy segments if needed for UI to not crash
                },
                requestId: requestId,
            });
        }

        console.log(
            ` [${new Date().toISOString()}] [${requestId}] Get Cart request received for session: ${sessionId}`
        );

        const data = await flightService.getCart(sessionId, requestId);

        return NextResponse.json({ status: "success", data, requestId });

    } catch (error) {
        console.error(
            ` [${new Date().toISOString()}] [${requestId}] Cart Error:`,
            error.message
        );
        return NextResponse.json(
            { error: error.message || "Internal server error", requestId },
            { status: 500 }
        );
    }
}
