// app/api/dashboard/save-user-traveller/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();

        const username = process.env.TP_USERNAME;
        const password = process.env.TP_PASSWORD;
        const baseUrl = process.env.API_BASE_URL;

        // بناء الفورم بنفس شكل Postman
        const formBody = new URLSearchParams({
            user_type: String(body.user_type || 4),
            user_id: String(body.user_id),
            json_list: JSON.stringify(body.json_list),
        });

        const res = await fetch(
            `${baseUrl}/api/dashboard/save-user-traveller`,
            {
                method: "POST",
                headers: {
                    Authorization:
                        "Basic " +
                        Buffer.from(`${username}:${password}`).toString(
                            "base64"
                        ),
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formBody.toString(),
            }
        );

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message: data?.message || "Request failed",
                },
                { status: res.status }
            );
        }

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error(" Error in save-user-traveller route:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
