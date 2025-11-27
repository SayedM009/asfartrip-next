import { NextResponse } from "next/server";
import { flightService } from "@/app/_services/flight-service";

// Simple in-memory cache
const CACHE = new Map();
const CACHE_TTL = 3 * 60 * 1000; // 3 minutes

function prepareRequestData(params) {
    const requestData = {
        origin: params.origin,
        destination: params.destination,
        depart_date: params.depart_date,
        ADT: params.ADT || 1,
        CHD: params.CHD || 0,
        INF: params.INF || 0,
        class: `${params.class[0].toUpperCase()}${params.class.slice(1)}`,
        type: params.type || "O",
    };

    if (params.type === "R" && params.return_date) {
        requestData.return_date = params.return_date;
    }

    return requestData;
}

function validateParams(params) {
    const required = ["origin", "destination", "depart_date", "class"];
    const missing = required.filter((field) => !params[field]);

    if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(", ")}`);
    }

    return true;
}

export async function POST(req) {
    const requestId = `REQ_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

    try {
        const body = await req.json();
        const { force_refresh, ...params } = body;

        validateParams(params);

        // Generate cache key based on search params (excluding force_refresh)
        const cacheKey = JSON.stringify(params);
        const cached = CACHE.get(cacheKey);

        if (!force_refresh && cached && Date.now() - cached.timestamp < CACHE_TTL) {
            console.log(
                ` [${new Date().toISOString()}] [${requestId}] Returning cached results`
            );
            return NextResponse.json(cached.data);
        }

        console.log(
            ` [${new Date().toISOString()}] [${requestId}] Initiating flight search... ${force_refresh ? '(Cache forced refresh)' : ''}`
        );

        const requestData = prepareRequestData(params);
        const data = await flightService.searchFlights(requestData, requestId);

        // Save to cache
        CACHE.set(cacheKey, { data, timestamp: Date.now() });

        console.log(
            ` [${new Date().toISOString()}] [${requestId}] Flight search successful`
        );

        return NextResponse.json(data);
    } catch (error) {
        console.error(
            ` [${new Date().toISOString()}] [${requestId}] Search Error:`,
            error.message
        );
        return NextResponse.json(
            { error: error.message || "Internal server error", requestId },
            { status: 500 }
        );
    }
}
