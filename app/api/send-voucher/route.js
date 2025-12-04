import { NextResponse } from "next/server";
import { getValidToken } from "@/app/_libs/token-manager";

/**
 * POST /api/send-voucher
 * Sends booking voucher/ticket to customer email
 * Works for all modules: FLIGHT, HOTEL, INSURANCE, etc.
 * 
 * Request body:
 * {
 *   "booking_reference": "AFT11F2513Z136323",
 *   "module": "FLIGHT" | "HOTEL" | "INSURANCE"
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
        const { booking_reference, module } = await req.json();

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

        if (!module) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Missing required field: module",
                },
                { status: 400 }
            );
        }

        // Validate module type
        const validModules = ['FLIGHT', 'HOTEL', 'INSURANCE', 'PACKAGE'];
        if (!validModules.includes(module.toUpperCase())) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Invalid module. Must be one of: ${validModules.join(', ')}`,
                },
                { status: 400 }
            );
        }

        console.log(`[${requestId}] Sending ${module} voucher for booking: ${booking_reference}`);

        // Get valid API token
        const apiToken = await getValidToken();

        if (!apiToken) {
            console.error(`[${requestId}]  Failed to get API token`);
            return NextResponse.json(
                {
                    success: false,
                    error: "Failed to get authentication token",
                },
                { status: 401 }
            );
        }

        // Log token (partially hidden for security)
        const tokenPreview = apiToken.substring(0, 10) + '...' + apiToken.substring(apiToken.length - 10);
        console.log(`[${requestId}] ✅ API Token obtained: ${tokenPreview}`);

        // Prepare request payload
        const payload = new URLSearchParams({
            api_token: apiToken,
            booking_reference: booking_reference,
            module: module.toUpperCase(),
        });

        console.log(`[${requestId}] SendVoucher API Payload:`, {
            booking_reference,
            module: module.toUpperCase(),
            api_token_length: apiToken.length,
            has_api_token: !!apiToken,
        });

        console.log(`[${requestId}] Full payload string:`, payload.toString().substring(0, 100) + '...');

        // Prepare Basic Auth credentials
        const username = process.env.TP_USERNAME;
        const password = process.env.TP_PASSWORD;
        const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

        console.log(`[${requestId}] Using Basic Auth with username: ${username}`);

        // Call backend sendVoucher API
        const response = await fetch(
            `${process.env.API_BASE_URL}/api/sendVoucher`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Basic ${basicAuth}`,
                },
                body: payload.toString(),
            }
        );

        console.log(`[${requestId}] Backend API Response Status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`[${requestId}]  SendVoucher API Error:`, {
                status: response.status,
                statusText: response.statusText,
                errorData,
            });
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

        console.log(`[${requestId}] ✅ ${module} voucher sent successfully for ${booking_reference}`);

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
