import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const user_id = formData.get("user_id");
        const user_type = formData.get("user_type");
        const tab = formData.get("tab");

        if (!user_id || !user_type || !tab) {
            return NextResponse.json(
                { success: false, message: "Missing required parameters" },
                { status: 400 }
            );
        }

        const username = process.env.TP_USERNAME;
        const password = process.env.TP_PASSWORD;
        const baseUrl =
            process.env.NEXT_PUBLIC_API_BASE_URL ||
            "https://uat-api.travelsprovider.com";

        // إعداد body بالطريقة المطلوبة
        const body = new URLSearchParams({
            user_id,
            user_type,
            tab,
        });

        const response = await fetch(`${baseUrl}/api/dashboard/bookings`, {
            method: "POST",
            headers: {
                Authorization: "Basic " + btoa(`${username}:${password}`),
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
            },
            body,
            cache: "no-store",
        });

        //  نتأكد إن في body قبل نحاول نحوله JSON
        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (err) {
            console.error("Response was not JSON:", text);
            throw new Error(
                `Invalid JSON response from API (${response.status})`
            );
        }

        if (!response.ok || !data?.status) {
            return NextResponse.json(
                {
                    success: false,
                    message: data?.message || "Failed to fetch bookings",
                },
                { status: 400 }
            );
        }

        const bookings = data.booking_list || [];

        const grouped = {
            flight: bookings.filter((b) => b.module === "FLIGHT"),
            hotel: bookings.filter((b) => b.module === "HOTEL"),
            insurance: bookings.filter((b) => b.module === "INSURANCE"),
            total: data.total || bookings.length,
        };

        return NextResponse.json({ success: true, data: grouped });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
