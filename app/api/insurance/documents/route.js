import { NextResponse } from "next/server";
import { insuranceService } from "@/app/_services/insurance-service";

export async function POST(req) {
    const requestId = `INS_DOCS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
        const body = await req.json();
        console.log(`\n[${requestId}] ===== GET INSURANCE DOCUMENTS =====`);
        console.log(`[${requestId}] Order ID:`, body.order_id);
        console.log(`[${requestId}] Policy ID:`, body.policy_id);

        // Validate
        if (!body.order_id) {
            return NextResponse.json(
                { error: "Missing required field: order_id", requestId },
                { status: 400 }
            );
        }

        if (!body.policy_id) {
            return NextResponse.json(
                { error: "Missing required field: policy_id", requestId },
                { status: 400 }
            );
        }

        // Call service
        const data = await insuranceService.getDocuments(
            String(body.order_id),
            String(body.policy_id),
            requestId
        );

        console.log(`[${requestId}] ✓ Documents retrieved successfully`);

        return NextResponse.json(data);

    } catch (error) {
        console.error(`\n[${requestId}] ❌ GET DOCUMENTS ERROR`);
        console.error(`[${requestId}] Message:`, error.message);
        console.error(`[${requestId}] Stack:`, error.stack);

        return NextResponse.json(
            {
                error: error.message || "Failed to get documents",
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
