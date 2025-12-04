import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        //  الخطوة الصحيحة: قراءة الـ body كنص
        const rawBody = await req.text();
        const params = new URLSearchParams(rawBody);
        const user_id = params.get("user_id");
        const id = params.get("id");

        if (!user_id || !id) {
            return NextResponse.json(
                { error: "Missing required fields (user_id, id)" },
                { status: 400 }
            );
        }

        const username = process.env.TP_USERNAME;
        const password = process.env.TP_PASSWORD;
        const apiUrl = `${process.env.API_BASE_URL}/traveller/delete_passenger_saved_list`;

        const basicAuth = Buffer.from(`${username}:${password}`).toString(
            "base64"
        );

        const body = new URLSearchParams({ user_id, id }).toString();

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${basicAuth}`,
            },
            body,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to delete traveller");
        }

        return NextResponse.json({
            status: "success",
            message: "Traveller deleted successfully.",
            data,
        });
    } catch (error) {
        console.error(" Error deleting traveller:", error.message);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
