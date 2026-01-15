
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

// ============== INSURANCE FUNCTIONS ==============

async function confirmInsuranceBooking(order_id) {
    try {
        const res = await fetch("/api/insurance/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_id }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to confirm insurance booking");
        return data;
    } catch (err) {
        console.error("confirmInsuranceBooking error:", err.message);
        throw err;
    }
}

async function purchaseInsurancePolicy(order_id) {
    try {
        const res = await fetch("/api/insurance/purchase", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_id }),
        });

        const data = await res.json();

        // Check if policy was successfully purchased
        if (data?.status === 'success' || data?.policy_id) {
            return { success: true, alreadyIssued: false, data };
        }

        // Check for "already purchased" messages
        const msg = (
            data?.status ||
            data?.message ||
            data?.error ||
            ""
        ).toLowerCase();

        if (msg.includes("already") || msg.includes("purchased")) {
            console.warn("Insurance policy already purchased for this order.");
            return { success: true, alreadyIssued: true, data };
        }

        if (!res.ok) {
            console.error("Failed to purchase insurance policy:", msg);
            throw new Error(msg || "Failed to purchase insurance policy");
        }

        return { success: true, alreadyIssued: false, data };
    } catch (err) {
        console.error("purchaseInsurancePolicy error:", err.message);
        throw err;
    }
}

// ============== EXPORTED FUNCTIONS ==============

export async function confirmBooking(paymentData) {
    const { module, booking_ref, order_id } = paymentData;

    switch (module?.toUpperCase()) {
        case 'FLIGHT':
            return await confirmFlightBooking(booking_ref);

        case 'INSURANCE':
            return await confirmInsuranceBooking(order_id);

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

        case 'INSURANCE':
            return await purchaseInsurancePolicy(paymentData.order_id);

        default:
            throw new Error(`Unsupported module for ticket issuance: ${module}`);
    }
}
