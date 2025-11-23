import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
    try {
        const url = process.env.NEXT_PUBLIC_API_BASE_URL;
        const username = process.env.TP_USERNAME;
        const password = process.env.TP_PASSWORD;

        if (!username || !password) {
            throw new Error("Missing API credentials configuration");
        }

        // Get the host from the request headers
        const headersList = await headers();
        const host = headersList.get("host");

        // Use the host from the request, or fallback to demo for localhost
        // You can add more local/dev domains to this check if needed
        const targetDomain =
            host && !host.includes("localhost")
                ? host
                : "whitelabel-demo.asfartrip.com";

        const basicAuth = Buffer.from(`${username}:${password}`).toString(
            "base64"
        );

        const res = await fetch(`${url}/api/website/${targetDomain}`, {
            method: "GET",
            headers: {
                Authorization: `Basic ${basicAuth}`,
                Accept: "application/json",
            },
            cache: "no-store",
        });

        if (!res.ok) {
            return NextResponse.json(
                {
                    status: "error",
                    message: `Upstream error: ${res.status} ${res.statusText}`,
                },
                { status: res.status }
            );
        }

        const data = await res.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            {
                status: "error",
                message: error.message ?? "Unknown error",
            },
            { status: 500 }
        );
    }
}
