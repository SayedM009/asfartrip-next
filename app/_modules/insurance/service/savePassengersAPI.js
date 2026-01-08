/**
 * Client-side service to save insurance passengers
 * Calls /api/insurance/save-passengers
 */
export async function saveInsurancePassengers(payload) {
    try {
        const formData = new URLSearchParams();

        for (const [key, value] of Object.entries(payload)) {
            // TravelerDetails: always JSON.stringify
            if (key === "TravelerDetails") {
                formData.append(key, JSON.stringify(value));
            } else if (typeof value === "object" && value !== null) {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value ?? "");
            }
        }

        console.log("[Insurance] Saving passengers:", {
            session_id: payload.session_id,
            travelers: payload.TravelerDetails?.length || 0,
        });

        const response = await fetch(`/api/insurance/save-passengers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error("Save insurance passengers error:", error);
        throw error;
    }
}
