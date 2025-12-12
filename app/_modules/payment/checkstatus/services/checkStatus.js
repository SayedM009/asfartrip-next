export async function checkStatus(bookingRef) {
    try {
        const response = await fetch("/api/payment/get-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingRef }),
        });

        const data = await response.json();
        if (!response.ok)
            throw new Error(data.error || "Failed to check payment status");
        return data;
    } catch (err) {
        console.error("checkStatus error:", err.message);
        throw err;
    }
}
