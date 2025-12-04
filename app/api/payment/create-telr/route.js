import { NextResponse } from "next/server";
import { getValidToken } from "@/app/_libs/token-manager";

/**
 * POST /api/payment/create-telr
 * Creates a Telr payment transaction for any module (FLIGHT, HOTEL, etc.)
 * 
 * Request body:
 * {
 *   "amount": "800",
 *   "currency": "AED",
 *   "merchant_order_id": "AFT11F2120Z136236",
 *   "description": "Flight booking - AFT11F2120Z136236",
 *   "module": "FLIGHT",
 *   "return_url": "https://example.com/payment/callback/AFT11F2120Z136236?gateway=telr&module=FLIGHT",
 *   "cancelled_url": "http://localhost:3000/en/payment/checkstatus/VS84B7X21Q01103132685",
 *   "declined_url": "http://localhost:3000/en/payment/checkstatus/VS84B7X21Q01103132685"
 * }
 */
export async function POST(request) {
    try {
        // Parse request body
        const body = await request.json();

        // Validate required fields
        const requiredFields = [
            "amount",
            "currency",
            "merchant_order_id",
            "description",
            "module",
            "return_url",
        ];

        const missingFields = requiredFields.filter((field) => !body[field]);

        if (missingFields.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Missing required fields",
                    missingFields,
                },
                { status: 400 }
            );
        }

        // Get valid API token
        const apiToken = await getValidToken();

        if (!apiToken) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Failed to authenticate with payment gateway",
                },
                { status: 401 }
            );
        }

        // Prepare Telr payment request
        const telrPayload = {
            amount: body.amount,
            api_token: apiToken,
            currency: body.currency || "AED",
            merchant_order_id: body.merchant_order_id,
            description: body.description,
            module: body.module,
            return_url: body.return_url,
            cancelled_url: body.cancelled_url || body.return_url,
            declined_url: body.declined_url || body.return_url,
            framed: body.framed || "3", // Default to iframe mode
        };

        // Call Telr API
        const telrResponse = await fetch(
            `${process.env.API_BASE_URL}/api/telr/create`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(telrPayload),
            }
        );

        if (!telrResponse.ok) {
            const errorData = await telrResponse.json().catch(() => ({}));
            console.error("Telr API Error:", errorData);

            return NextResponse.json(
                {
                    success: false,
                    error: "Payment gateway error",
                    details: errorData,
                },
                { status: telrResponse.status }
            );
        }

        const telrData = await telrResponse.json();

        // Return success response
        return NextResponse.json({
            success: true,
            data: telrData,
        });
    } catch (error) {
        console.error("Create Telr Payment Error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Internal server error",
                message: error.message,
            },
            { status: 500 }
        );
    }
}
