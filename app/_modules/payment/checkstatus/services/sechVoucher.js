export async function sendVoucher(booking_reference, module) {
    try {
        if (!booking_reference) {
            throw new Error("booking_reference is required");
        }

        if (!module) {
            throw new Error("module is required");
        }

        const res = await fetch(`/api/send-voucher`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                booking_reference,
                module: module.toUpperCase()
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            console.error(` Failed to send ${module} voucher:`, data.error);
            throw new Error(data.error || "Failed to send voucher");
        }

        console.log(` ${module} voucher sent successfully for:`, booking_reference);
        return data;
    } catch (err) {
        console.error("sendVoucher error:", err.message);
        throw err;
    }
}