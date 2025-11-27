import { NextResponse } from "next/server";
import { getValidToken } from "@/app/_libs/token-manager";

/**
 * POST /api/flight/send-voucher
 * Sends flight voucher/ticket to customer email
 * 
 * Request body:
 * {
 *   "booking_reference": "AFT11F2513Z136323",
 *   "module": "FLIGHT"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Voucher sent successfully"
 * }
 */
export async function POST(req) {
    const requestId = `SEND_VOUCHER_${Date.now()}`;
    try {
        const { booking_reference, module = "FLIGHT" } = await req.json();

        // Validate required fields
        if (!booking_reference) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Missing required field: booking_reference",
                },
                { status: 400 }
            );
        }

        console.log(`[${requestId}] Sending voucher for booking: ${booking_reference}`);

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

        // Prepare request payload
        const payload = new URLSearchParams({
            api_token: apiToken,
            booking_reference: booking_reference,
            module: module,
        });

        console.log(`[${requestId}] SendVoucher API Payload:`, {
            booking_reference,
            module,
        });

        // Call backend sendVoucher API
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sendVoucher`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: payload.toString(),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`[${requestId}] SendVoucher API Error:`, errorData);
            return NextResponse.json(
                {
                    success: false,
                    error:
                        errorData.message ||
                        `SendVoucher API error: ${response.status}`,
                },
                { status: response.status }
            );
        }

        const data = await response.json();

        console.log(`[${requestId}] Voucher sent successfully for ${booking_reference}`);

        return NextResponse.json({
            success: true,
            message: "Voucher sent successfully",
            data: data,
        });
    } catch (error) {
        console.error(`[${requestId}] Send Voucher Error:`, error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}
