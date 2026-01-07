import { NextResponse } from "next/server";
import { insuranceService } from "@/app/_services/insurance-service";

function validateCartParams(body) {
    const required = ["quote_id", "scheme_id", "searchParams"];
    const missing = required.filter((field) => !body[field]);

    if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(", ")}`);
    }
    return true;
}

export async function POST(req) {
    const requestId = `CART_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
        const body = await req.json();
        console.log(`\n[${requestId}] ===== ADD TO CART REQUEST =====`);
        console.log(`[${requestId}] Body:`, JSON.stringify(body, null, 2));

        // Validate
        validateCartParams(body);

        // Prepare request string (matching old format)
        const requestString = JSON.stringify(body.searchParams);

        // Prepare plan string (matching old format - the ENTIRE plan object as string)
        const planString = JSON.stringify(body.plan || {});

        console.log(`[${requestId}] Calling insuranceService.addToCart with:`);
        console.log(`  - request: ${requestString.substring(0, 100)}...`);
        console.log(`  - quote_id: ${body.quote_id}`);
        console.log(`  - scheme_id: ${body.scheme_id}`);
        console.log(`  - plan: ${planString.substring(0, 100)}...`);

        // Call service - matching old API signature
        const data = await insuranceService.addToCart(
            requestString,
            String(body.quote_id),
            String(body.scheme_id),
            planString,
            requestId
        );

        console.log(`[${requestId}] ✓ Cart response received`);
        console.log(`[${requestId}] Session ID:`, data.session_id);

        return NextResponse.json(data);

    } catch (error) {
        console.error(`\n[${requestId}] ❌ ADD TO CART ERROR`);
        console.error(`[${requestId}] Message:`, error.message);
        console.error(`[${requestId}] Stack:`, error.stack);

        return NextResponse.json(
            {
                error: error.message || "Failed to add to cart",
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