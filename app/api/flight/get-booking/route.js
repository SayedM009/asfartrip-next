import { NextResponse } from "next/server";
import {
    clearAPIToken,
    loginWithExistsCredintials,
} from "@/app/_libs/token-manager";

export async function POST(req) {
    const requestId = `GET_BOOKING_${Date.now()}`;
    try {
        const { booking_reference } = await req.json();
        if (!booking_reference) throw new Error("Missing booking_reference");

        let token = await loginWithExistsCredintials();
        const username = process.env.TP_USERNAME;
        const password = process.env.TP_PASSWORD;
        const basicAuth = Buffer.from(`${username}:${password}`).toString(
            "base64"
        );

        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/flight/getBooking`;
        const formData = new URLSearchParams({
            booking_reference,
            api_token: token,
        });

        let res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${basicAuth}`,
            },
            body: formData.toString(),
        });

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error(`[${requestId}]`, err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
