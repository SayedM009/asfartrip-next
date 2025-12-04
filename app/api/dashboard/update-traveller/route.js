import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { user_id, id, list } = await req.json();

        if (!user_id || !id || !list) {
            return NextResponse.json(
                { error: "Missing required fields (user_id, id, list)" },
                { status: 400 }
            );
        }

        const username = process.env.TP_USERNAME;
        const password = process.env.TP_PASSWORD;
        const apiUrl = `${process.env.API_BASE_URL}/traveller/update_passenger`;

        const basicAuth = Buffer.from(`${username}:${password}`).toString(
            "base64"
        );

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${basicAuth}`,
            },
            body: JSON.stringify({ user_id, id, list }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to update traveller");
        }

        return NextResponse.json({
            status: "success",
            message: "Traveller updated successfully.",
            data,
        });
    } catch (error) {
        console.error(" Error updating traveller:", error.message);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
