
async function confirmFlightBooking(booking_reference) {
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

async function issueFlightBooking(
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
            }),
        });

        const data = await res.json();

        //  Check if ticket was successfully issued
        if (data?.data?.ticket_status === 'CREATED' && data?.data?.ticket_numbers === 'Yes') {
            return { success: true, alreadyIssued: false, data };
        }

        // Check for "already been executed" or "already issued" messages
        const msg = (
            data?.status ||
            data?.message ||
            data?.error ||
            ""
        ).toLowerCase();

        if (msg.includes("already been executed") || msg.includes("already issued")) {
            console.warn("Ticket already issued for this booking.");
            return { success: true, alreadyIssued: true, data };
        }

        //  Any other case - treat as failure/pending
        if (!res.ok) {
            console.error(" Failed to issue ticket:", msg);
            throw new Error(msg || "Failed to issue ticket");
        }

        // If we reach here, ticket is pending or failed
        return { success: true, alreadyIssued: false, data };
    } catch (err) {
        console.error("issueFlightBooking error:", err.message);
        throw err;
    }
}


export async function confirmBooking(paymentData) {
    const { module, booking_ref, order_id } = paymentData;

    switch (module?.toUpperCase()) {
        case 'FLIGHT':
            return await confirmFlightBooking(booking_ref);

        default:
            throw new Error(`Unsupported booking module: ${module}`);
    }
}

export async function issueTicket(confirmData, paymentData) {
    const { module } = paymentData;

    switch (module?.toUpperCase()) {
        case 'FLIGHT':
            const transaction_id = paymentData.gateway_response?.id ||
                paymentData.gateway_response?.transaction_id ||
                paymentData.order_id;



            return await issueFlightBooking(
                confirmData.booking_reference,
                transaction_id,
                "Payment Gateway"
            );

        default:
            throw new Error(`Unsupported module for ticket issuance: ${module}`);
    }
}
