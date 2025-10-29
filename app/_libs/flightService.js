// 1. Search airports
const API = process.env.NEXT_PUBLIC_APP_API_BASE_URL;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function searchAirports(value) {
    if (!value) throw new Error("There is no value");
    try {
        const res = await fetch(`${API}/api/flight/airports?term=${value}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error.message);
    }
}

export async function getCart(sessionId) {
    const res = await fetch(`${baseUrl}/api/flight/get-cart`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id: sessionId }),
        cache: "no-store",
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch cart");
    }

    const data = await res.json();
    return data.data;
}

// From Grok
export async function savePassengers(payload) {
    try {
        const formData = new URLSearchParams();

        for (const [key, value] of Object.entries(payload)) {
            if (key === "TravelerDetails") {
                formData.append(key, JSON.stringify(value));
            }
            // إرسال passenger_full_details إذا كان موجودًا وغير فارغ
            else if (key === "passenger_full_details" && value) {
                formData.append(key, value);
            } else if (
                key === "insurance" &&
                typeof value === "object" &&
                value !== null
            ) {
                formData.append(key, JSON.stringify(value));
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

export async function confirmFlightBooking(booking_reference) {
    try {
        const res = await fetch("/api/flight/confirm-booking", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: JSON.stringify({ booking_reference }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to confirm booking");
        return data;
    } catch (err) {
        console.error("confirmFlightBooking error:", err.message);
        throw err;
    }
}

export async function issueFlightBooking(
    booking_reference,
    transaction_id,
    payment_method = "Payment Gateway"
) {
    try {
        const res = await fetch("/api/flight/issue-ticket", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                booking_reference,
                transaction_id,
                payment_method,
                // transaction_id: "7f92030a-cc2a-4781-9bfb-8873abc28cec",
                // payment_method: "Payment Gateway",
            }),
        });

        const data = await res.json();

        // 🟢 unified message for parsing
        const msg = (
            data?.status ||
            data?.message ||
            data?.error ||
            ""
        ).toLowerCase();

        // ✅ لو التذكرة صادرة مسبقًا
        if (msg.includes("already been executed")) {
            console.warn("⚠️ Ticket already issued for this booking.");
            return { success: true, alreadyIssued: true, data };
        }

        // ⚠️ أي خطأ فعلي آخر
        if (!res.ok) throw new Error(msg || "Failed to issue ticket");

        return { success: true, alreadyIssued: false, data };
    } catch (err) {
        console.error("issueFlightBooking error:", err.message);
        throw err;
    }
}

export async function getFlightBookingDetails(booking_reference) {
    try {
        const res = await fetch(`${baseUrl}/api/flight/get-booking`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ booking_reference }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to get booking");
        return data;
    } catch (err) {
        console.error("getFlightBookingDetails error:", err.message);
        throw err;
    }
}

// export async function confirmBooking(payload) {
//     try {
//         const response = await fetch("/api/flight/confirm", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload),
//         });

//         const contentType = response.headers.get("content-type");
//         if (!contentType || !contentType.includes("application/json")) {
//             const text = await response.text();
//             console.error("Invalid response from confirm API:", text);
//             throw new Error("Invalid response format from confirm API");
//         }

//         const data = await response.json();
//         if (!response.ok) {
//             throw new Error(data.message || "Failed to confirm booking");
//         }

//         return data;
//     } catch (error) {
//         console.error("Confirm booking service error:", error.message, {
//             payload,
//         });
//         throw error;
//     }
// }

// export async function issueTicket(payload) {
//     try {
//         const response = await fetch("/api/flight/issue", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload),
//         });

//         const contentType = response.headers.get("content-type");
//         if (!contentType || !contentType.includes("application/json")) {
//             const text = await response.text();
//             console.error("Invalid response from issue API:", text);
//             throw new Error("Invalid response format from issue API");
//         }

//         const data = await response.json();
//         if (!response.ok) {
//             throw new Error(data.message || "Failed to issue ticket");
//         }

//         return data;
//     } catch (error) {
//         console.error("Issue ticket service error:", error.message, {
//             payload,
//         });
//         throw error;
//     }
// }
