export async function checkAirPricing({
    rawRequestBase64,
    rawResponseBase64,
    originalPrice,
}) {
    if (!rawRequestBase64 || !rawResponseBase64) {
        return {
            status: "error",
            message: "Missing flight data. Please search again.",
        };
    }

    try {
        const res = await fetch("/api/flight/air-pricing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                request: rawRequestBase64,
                response: rawResponseBase64,
                originalPrice,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                status: "error",
                message: data.error || "Failed to check pricing",
            };
        }

        return data;
    } catch (error) {
        return { status: "error", message: error.message };
    }
}
