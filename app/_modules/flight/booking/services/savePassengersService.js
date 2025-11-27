import { baseUrl } from "@/app/_config/constants";
export async function savePassengers(payload) {
    try {
        const formData = new URLSearchParams();

        for (const [key, value] of Object.entries(payload)) {
            // TravelerDetails: always JSON.stringify
            if (key === "TravelerDetails") {
                formData.append(key, JSON.stringify(value));
            }

            // Passenger full details (base64 encoded JSON)
            else if (key === "passenger_full_details" && value) {
                formData.append(key, value);

                // Insurance (object)
            } else if (
                key === "insurance" &&
                typeof value === "object" &&
                value !== null
            ) {
                formData.append(key, JSON.stringify(value));

                // Everything else
            } else {
                formData.append(key, value ?? "");
            }
        }

        console.log("Sending payload:", formData.toString());

        const response = await fetch(`${baseUrl}/api/flight/save-passengers`, {
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
        console.error("Save passengers error:", error);
        throw error;
    }
}
