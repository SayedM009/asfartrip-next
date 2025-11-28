import { NextResponse } from "next/server";
import { getValidToken } from "@/app/_libs/token-manager";

/**
 * POST telr
 * Checks the status of a Telr payment transaction
 * 
 * Request body:
 * {
 *   "order_ref": "A9896DDE87F06A875FAE454D2676379F246D089288743E4FBFDE11C8B48FAE1E"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     // Telr check response data
 *   }
 * }
 */
export async function POST(request) {
    try {
        // Parse request body
        const body = await request.json();

        // Validate required fields
        if (!body.order_ref) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Missing required field: order_ref",
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
                    error: "Failed to get authentication token",
                },
                { status: 401 }
            );
        }

        // Prepare Telr check request
        const telrPayload = {
            api_token: apiToken,
            order_ref: body.order_ref,
        };

        // Call Telr check API
        const telrResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/telr/check`,
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
            console.error("Telr Check API Error:", errorData);
            return NextResponse.json(
                {
                    success: false,
                    error:
                        errorData.message ||
                        `Telr API error: ${telrResponse.status}`,
                },
                { status: telrResponse.status }
            );
        }

        const telrData = await telrResponse.json();

        return NextResponse.json({
            success: true,
            data: telrData,
        });
    } catch (error) {
        console.error("Check Telr Payment Error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}
