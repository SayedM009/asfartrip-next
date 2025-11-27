/**
 * Service to create Telr payment transaction
 * @param {Object} payload - Payment details
 * @returns {Promise<Object>} Telr payment response
 */
export async function createTelrPayment(payload) {
    try {
        const response = await fetch('/api/payment/create-telr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to create Telr payment');
        }

        return await response.json();
    } catch (error) {
        console.error('Create Telr Payment Error:', error);
        throw error;
    }
}
