import { NextResponse } from "next/server";
import { insuranceService } from "@/app/_services/insurance-service";

function validateGetCartParams(body) {
    if (!body.session_id) {
        throw new Error("Missing required field: session_id");
    }
    return true;
}

export async function POST(req) {
    const requestId = `GETCART_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
        const body = await req.json();
        console.log(`\n[${requestId}] ===== GET CART REQUEST =====`);
        console.log(`[${requestId}] Session ID:`, body.session_id);

        // Validate
        validateGetCartParams(body);

        // Call service
        const data = await insuranceService.getCart(
            String(body.session_id),
            requestId
        );

        console.log(`[${requestId}] ✓ Cart retrieved successfully`);
        console.log(`[${requestId}] Cart data keys:`, Object.keys(data));

        return NextResponse.json(data);

    } catch (error) {
        console.error(`\n[${requestId}] ❌ GET CART ERROR`);
        console.error(`[${requestId}] Message:`, error.message);
        console.error(`[${requestId}] Stack:`, error.stack);

        return NextResponse.json(
            {
                error: error.message || "Failed to retrieve cart",
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