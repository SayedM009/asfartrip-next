import { NextResponse } from "next/server";
import { flightService } from "@/app/_services/flight-service";

function validatePayload(payload) {
    if (!payload.request || !payload.response) {
        throw new Error(
            "Missing required fields: request and response payloads are required"
        );
    }

    if (
        typeof payload.request !== "string" ||
        typeof payload.response !== "string"
    ) {
        throw new Error(
            "Invalid payload format: request and response must be strings"
        );
    }

    return true;
}

export async function POST(req) {
    const requestId = `PRICE_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

    try {
        console.log(
            `[${new Date().toISOString()}] [${requestId}] Air pricing request received`
        );

        const payload = await req.json();
        validatePayload(payload);

        console.log(
            `[${new Date().toISOString()}] [${requestId}] Payload validated`
        );

        const requestData = {
            request: payload.request,
            response: payload.response,
        };

        console.log(
            `[${new Date().toISOString()}] [${requestId}] Checking flight pricing...`
        );

        const data = await flightService.checkPricing(requestData, requestId);

        console.log(
            `[${new Date().toISOString()}] [${requestId}] Pricing response:`,
            {
                status: data.Status,
                totalPrice: data.TotalPrice,
                currency: data.Currency,
                hasSessionId: !!data.session_id,
                hasTempId: !!data.temp_id,
            }
        );

        if (!data.Status) {
            console.warn(
                `[${new Date().toISOString()}] [${requestId}] Invalid response structure`
            );
            return NextResponse.json(
                {
                    error: "Invalid pricing response from server",
                    requestId: requestId,
                },
                { status: 500 }
            );
        }

        switch (data.Status) {
            case "Success":
                console.log(
                    `[${new Date().toISOString()}] [${requestId}] Pricing successful: ${data.TotalPrice
                    } ${data.Currency}`
                );

                if (!data.session_id || !data.temp_id) {
                    console.error(
                        `[${new Date().toISOString()}] [${requestId}] Missing session_id or temp_id in success response`
                    );
                    return NextResponse.json(
                        {
                            error: "Invalid pricing response: missing session data",
                            requestId: requestId,
                        },
                        { status: 500 }
                    );
                }

                return NextResponse.json({
                    status: "success",
                    data: {
                        sessionId: data.session_id,
                        tempId: data.temp_id,
                        basePrice: data.BasePrice,
                        taxPrice: data.TaxPrice,
                        totalPrice: data.TotalPrice,
                        currency: data.Currency,
                        baggageData: data.Baggage_data,
                        fareRules: data.FareRules || [],
                    },
                    requestId: requestId,
                });

            case "PriceChanged":
            case "Price Changed":
                console.log(
                    `[${new Date().toISOString()}] [${requestId}] Price changed`
                );
                return NextResponse.json({
                    status: "price_changed",
                    data: {
                        oldPrice: payload.originalPrice,
                        newPrice: data.TotalPrice,
                        basePrice: data.BasePrice,
                        taxPrice: data.TaxPrice,
                        totalPrice: data.TotalPrice,
                        currency: data.Currency,
                        sessionId: data.session_id,
                        tempId: data.temp_id,
                    },
                    message:
                        "Flight price has changed. Please review the new price.",
                    requestId: requestId,
                });

            case "NotAvailable":
            case "Not Available":
            case "Unavailable":
                console.log(
                    `[${new Date().toISOString()}] [${requestId}] Flight not available`
                );
                return NextResponse.json({
                    status: "not_available",
                    message:
                        "This flight is no longer available. Please search again.",
                    requestId: requestId,
                });

            case "Error":
            case "Failed":
                console.error(
                    `[${new Date().toISOString()}] [${requestId}] Pricing failed:`,
                    data.Message || data.message
                );
                return NextResponse.json(
                    {
                        status: "error",
                        error:
                            data.Message ||
                            data.message ||
                            "Pricing check failed",
                        requestId: requestId,
                    },
                    { status: 400 }
                );

            default:
                console.warn(
                    `[${new Date().toISOString()}] [${requestId}] Unknown status: ${data.Status
                    }`
                );
                return NextResponse.json({
                    status: "unknown",
                    data: data,
                    message: `Unexpected status: ${data.Status}`,
                    requestId: requestId,
                });
        }
    } catch (error) {
        console.error(
            `[${new Date().toISOString()}] [${requestId}] Critical error:`,
            error.message
        );
        return NextResponse.json(
            {
                error: error.message || "Internal server error",
                requestId: requestId,
            },
            { status: 500 }
        );
    }
}
