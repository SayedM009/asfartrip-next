

import { AIRPORTS_AR } from "./airportsAr";

export async function fetchAirportName(code, locale = "en") {
    const API = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Check local dictionary first for Arabic
    if (locale === "ar" && AIRPORTS_AR[code]) {
        return AIRPORTS_AR[code];
    }

    try {
        const res = await fetch(`${API}/api/flight/airports?term=${code}`);
        const data = await res.json();

        const airport = Array.isArray(data) ? data[0] : data;

        if (!airport?.value) return code;

        const match = airport.value.match(/\([A-Z]{3}\)$/);
        const lastCode = match ? match[0] : `(${code})`;

        const cleanName = airport.value.replace(/\([A-Z]{3}\)/g, "").trim();

        return `${cleanName} ${lastCode}`;
    } catch (e) {
        console.error(`Error fetching airport ${code}:`, e);
        return code;
    }
}
