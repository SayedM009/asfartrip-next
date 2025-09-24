// app/_libs/flightService.js
import { getApiToken } from "./auth";
import qs from "qs";

// app/_libs/flightService.js

export async function searchFlights(params) {
    // جلب التوكن
    const token = await getApiToken();
    if (!token) throw new Error("No API token found");

    // تجهيز بيانات الـ payload بنفس ترتيب وشكل الحقول اللي شغال
    const requestData = {
        origin: params.origin,
        destination: params.destination,
        depart_date: params.depart_date,
        ADT: params.ADT || 1,
        CHD: params.CHD || 0,
        INF: params.INF || 0,
        class: params.class,
        type: params.type || "O",
        api_token: token,
    };

    if (params.type === "R" && params.return_date)
        requestData.return_date = params.return_date;

    // إعداد الـ Basic Auth
    const username = process.env.TP_USERNAME;
    const password = process.env.TP_PASSWORD;
    const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

    // إرسال الطلب
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/flight/search`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${basicAuth}`,
            },
            body: qs.stringify(requestData),
        }
    );

    // التحقق من الاستجابة
    if (!res.ok) {
        const errText = await res.text();
        console.error("Search error body:", qs.stringify(requestData));
        console.error("Search response:", errText);
        throw new Error("Failed to search flights");
    }

    // إعادة البيانات بصيغة JSON
    return await res.json();
}
