import { NextResponse } from "next/server";
import { insuranceService } from "@/app/_services/insurance-service";

export async function POST(req) {
    const requestId = `INS_CONFIRM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
        const body = await req.json();
        console.log(`\n[${requestId}] ===== CONFIRM INSURANCE BOOKING =====`);
        console.log(`[${requestId}] Order ID:`, body.order_id);

        // Validate
        if (!body.order_id) {
            return NextResponse.json(
                { error: "Missing required field: order_id", requestId },
                { status: 400 }
            );
        }

        // Call service
        const data = await insuranceService.confirmBooking(
            String(body.order_id),
            requestId
        );

        console.log(`[${requestId}] ✓ Booking confirmed successfully`);

        return NextResponse.json(data);

    } catch (error) {
        console.error(`\n[${requestId}] ❌ CONFIRM BOOKING ERROR`);
        console.error(`[${requestId}] Message:`, error.message);
        console.error(`[${requestId}] Stack:`, error.stack);

        return NextResponse.json(
            {
                error: error.message || "Failed to confirm booking",
                requestId,
                details: process.env.NODE_ENV === 'development' ? {
                    stack: error.stack,
                    message: error.message
                } : undefined
            },
            { status: 500 }
        );
    }
}
