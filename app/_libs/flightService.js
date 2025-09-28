// app/_libs/flightService.js
import qs from "qs";
import { getApiToken, loginWithExistsCredintials } from "./auth";

// app/_libs/flightService.js

export async function searchFlights(params) {
    let token = await getApiToken(); // جلب التوكن من الكوكي
    if (!token) token = await loginWithExistsCredintials(); // لو مش موجود، سجل دخول وخد التوكن

    // تجهيز بيانات الـ payload
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

    const username = process.env.TP_USERNAME;
    const password = process.env.TP_PASSWORD;
    const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/flight/search`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${basicAuth}`,
            },
            body: new URLSearchParams(requestData),
        }
    );

    if (!res.ok) {
        const errText = await res.text();
        console.error("Search error body:", requestData);
        console.error("Search response:", errText);
        throw new Error("Failed to search flights");
    }

    return await res.json();
}
