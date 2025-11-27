import { checkStatus } from "@/app/_libs/paymentService";

/**
 * Check payment status for both Telr and external gateways
 * @param {string} booking_ref - Booking reference
 * @param {string} gateway - Gateway name (TELR, ZIINA, etc.)
 * @param {string} order_ref - Telr order reference (only for Telr)
 * @returns {Promise<Object>} Normalized payment response
 */
export async function checkPayment(booking_ref, gateway = 'ZIINA', order_ref = null) {
    if (gateway?.toUpperCase() === 'TELR') {
        // Check Telr payment
        const response = await fetch('/api/payment/check-telr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                order_ref: order_ref || booking_ref,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to check Telr payment status');
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Telr payment check failed');
        }

        const telrData = result.data;



        // Normalize Telr response to match expected format
        return {
            status: telrData.status || 'success',
            amount: telrData.amount,
            currency: telrData.currency,
            gateway_response: {
                // Extract status text from status object
                status: telrData.gateway_response?.status?.text ||
                    telrData.payment_status ||
                    'completed',
                // Extract transaction ID from transaction.ref
                id: telrData.gateway_response?.transaction?.ref ||
                    telrData.transaction_id ||
                    null,
                transaction_id: telrData.gateway_response?.transaction?.ref ||
                    telrData.transaction_id ||
                    null,
            },
            module: telrData.module || 'FLIGHT',
            order_id: telrData.merchant_order_id || telrData.order_id || booking_ref,
            booking_ref: booking_ref,
            order_status: telrData.order_status ||
                (telrData.payment_status?.toLowerCase() === 'success' ? 'Success' : 'Pending'),
            payment_status: telrData.payment_status ||
                telrData.gateway_response?.status?.text ||
                'completed',
            // Extract card info from gateway_response.card
            card_type: telrData.gateway_response?.card?.type || null,
            card_last4: telrData.gateway_response?.card?.last4 || null,
            transaction_date: telrData.gateway_response?.transaction?.date || null,
        };
    } else {
        // Check external gateway (Ziina, etc.)
        return await checkStatus(booking_ref);
    }
}
