import { NextResponse } from "next/server";
import { insuranceService } from "@/app/_services/insurance-service";

// Simple in-memory cache
const CACHE = new Map();
const CACHE_TTL = 3 * 60 * 1000; // 3 minutes

function prepareRequestData(params) {
    try {
        const parsedDates = JSON.parse(params.dates);
        const parsedPassengers = JSON.parse(params.passengers);

        const requestData = {
            region: params.region,
            depart_date: parsedDates.from,
            journey_type: params.trip_type || params.tripType,
            adults: String(parsedPassengers.adults || 0),
            children: String(parsedPassengers.children || 0),
            seniors: String(parsedPassengers.seniors || 0),
        };

        const tripType = params.trip_type || params.tripType;
        if (tripType === "single" && parsedDates.to) {
            requestData.return_date = parsedDates.to;
        }

        return requestData;
    } catch (error) {
        console.error('Error in prepareRequestData:', error);
        throw new Error(`Failed to prepare request data: ${error.message}`);
    }
}

function validateParams(params) {
    try {
        // Check if dates and passengers are valid JSON
        const parsedDates = JSON.parse(params.dates);
        const parsedPassengers = JSON.parse(params.passengers);

        const preparedParams = {
            region: params.region,
            depart_date: parsedDates.from,
            adults: parsedPassengers.adults,
            trip_type: params.trip_type || params.tripType,
        };

        const required = ["region", "depart_date", "adults", "trip_type"];
        const missing = required.filter((field) => !preparedParams[field]);

        if (missing.length > 0) {
            throw new Error(`Missing required fields: ${missing.join(", ")}`);
        }

        // Validate trip type
        const validTripTypes = ["single", "annual", "biennial"];
        if (!validTripTypes.includes(preparedParams.trip_type)) {
            throw new Error(`Invalid trip_type: ${preparedParams.trip_type}. Must be one of: ${validTripTypes.join(", ")}`);
        }

        return true;
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error(`Invalid JSON in dates or passengers: ${error.message}`);
        }
        throw error;
    }
}

export async function POST(req) {
    const requestId = `REQ_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

    try {
        // Parse request body
        const body = await req.json();
        console.log(`\n[${new Date().toISOString()}] [${requestId}] ===== NEW REQUEST =====`);
        console.log(`[${requestId}] Received body:`, JSON.stringify(body, null, 2));

        const { force_refresh, ...params } = body;

        // Validate params
        try {
            validateParams(params);
        } catch (validationError) {
            console.error(`[${requestId}] Validation failed:`, validationError.message);
            return NextResponse.json(
                { error: validationError.message, requestId },
                { status: 400 }
            );
        }

        // Generate cache key
        const cacheKey = JSON.stringify(params);
        const cached = CACHE.get(cacheKey);

        // Check cache
        if (!force_refresh && cached && Date.now() - cached.timestamp < CACHE_TTL) {
            console.log(`[${requestId}] ✓ Returning cached results (age: ${Math.round((Date.now() - cached.timestamp) / 1000)}s)`);
            return NextResponse.json(cached.data);
        }

        console.log(`[${requestId}] Initiating insurance search... ${force_refresh ? '(forced refresh)' : '(cache miss)'}`);

        // Prepare request data
        const requestData = prepareRequestData(params);
        console.log(`[${requestId}] Prepared request data:`, JSON.stringify(requestData, null, 2));

        // Call insurance service
        const data = await insuranceService.searchQuotes(requestData, requestId);

        console.log(`[${requestId}] ✓ Received response from service`);
        console.log(`[${requestId}] Response preview:`, JSON.stringify(data).substring(0, 200) + '...');

        // Save to cache
        CACHE.set(cacheKey, { data, timestamp: Date.now() });
        console.log(`[${requestId}] ✓ Saved to cache`);

        return NextResponse.json(data);

    } catch (error) {
        console.error(`\n[${requestId}] ❌ ERROR:`, error.message);
        console.error(`[${requestId}] Stack:`, error.stack);

        return NextResponse.json(
            {
                error: error.message || "Internal server error",
                requestId,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}