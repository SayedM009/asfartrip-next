import { getValidToken, clearAPIToken } from "../_libs/token-manager";

const BASE_URL = process.env.API_BASE_URL;

class InsuranceService {
    /**
     * Generic request handler with token management and retry logic
     * @param {string} endpoint - API endpoint (e.g., '/api/flight/search')
     * @param {Object} params - Request body parameters
     * @param {string} requestId - Request ID for logging
     * @param {number} timeout - Request timeout in ms (default 30000)
     * @returns {Promise<Object>} - API response data
     */
    async request(endpoint, params, requestId = "unknown", timeout = 30000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            // 1. Get valid token
            let token = await getValidToken();

            // 2. Prepare credentials
            const username = process.env.TP_USERNAME;
            const password = process.env.TP_PASSWORD;
            const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

            // Debug log
            console.log(
                ` [${new Date().toISOString()}] [${requestId}] Sending request to ${endpoint} with keys:`,
                Object.keys({ ...params, api_token: "MASKED" })
            );

            // 3. Make request
            let response = await fetch(`${BASE_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${basicAuth}`,
                },
                body: new URLSearchParams({ ...params, api_token: token }),
                cache: "no-store",
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            // 4. Handle 401/403 (Token Expired/Invalid)
            if (response.status === 401 || response.status === 403) {
                console.warn(
                    ` [${new Date().toISOString()}] [${requestId}] Auth failed (401/403). Retrying with fresh token...`
                );

                // Clear old token and force refresh
                await clearAPIToken();
                token = await getValidToken();

                // Retry request
                const retryController = new AbortController();
                const retryTimeoutId = setTimeout(() => retryController.abort(), timeout);

                try {
                    response = await fetch(`${BASE_URL}${endpoint}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            Authorization: `Basic ${basicAuth}`,
                        },
                        body: new URLSearchParams({ ...params, api_token: token }),
                        cache: "no-store",
                        signal: retryController.signal,
                    });
                    clearTimeout(retryTimeoutId);
                } catch (retryError) {
                    clearTimeout(retryTimeoutId);
                    throw retryError;
                }
            }

            // 5. Handle other errors
            if (!response.ok) {
                const errorText = await response.text();
                console.error(
                    `[${new Date().toISOString()}] [${requestId}] API Error: ${response.status} ${response.statusText}`,
                    errorText
                );
                throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
            }

            // 6. Return JSON
            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === "AbortError") {
                console.error(` [${new Date().toISOString()}] [${requestId}] Request timed out after ${timeout}ms`);
                throw new Error(`Request timeout after ${timeout}ms`);
            }

            console.error(
                ` [${new Date().toISOString()}] [${requestId}] FlightService Error:`,
                error.message
            );
            throw error;
        }
    }

    /**
     * Search for flights
     * @param {Object} searchParams - Search parameters
     * @param {string} requestId - Optional request ID
     */
    async searchQuotes(searchParams, requestId) {
        return this.request("/api/v2/insurance/quote", searchParams, requestId);
    }

    /**
     * Check flight pricing
     * @param {Object} pricingParams - Pricing parameters
     * @param {string} requestId - Optional request ID
     */
    async checkPricing(pricingParams, requestId) {
        return this.request("/api/flight/airpricing", pricingParams, requestId, 45000);
    }
    /**
     * Get cart details
     * @param {string} sessionId - Session ID
     * @param {string} requestId - Optional request ID
     */
    async getCart(sessionId, requestId) {
        return this.request("/api/flight/getCart", { session_id: sessionId }, requestId);
    }

    /**
     * Save passengers
     * @param {Object} params - Passenger details and booking info
     * @param {string} requestId - Optional request ID
     */
    async savePassengers(params, requestId) {
        // Ensure TravelerDetails is a string if it's an object
        const requestParams = { ...params };
        if (requestParams.TravelerDetails && typeof requestParams.TravelerDetails === 'object') {
            requestParams.TravelerDetails = JSON.stringify(requestParams.TravelerDetails);
        }
        return this.request("/api/flight/save", requestParams, requestId);
    }

    /**
     * Confirm booking
     * @param {Object} params - Confirmation params (booking_reference)
     * @param {string} requestId - Optional request ID
     */
    async confirmBooking(params, requestId) {
        return this.request("/api/flight/confirmbooking", params, requestId);
    }

    /**
     * Issue ticket
     * @param {Object} params - Issue ticket params (booking_reference, transaction_id, payment_method)
     * @param {string} requestId - Optional request ID
     */
    async issueTicket(params, requestId) {
        return this.request("/api/flight/issueticket", params, requestId);
    }

    /**
     * Get booking details
     * @param {Object} params - Get booking params (booking_reference)
     * @param {string} requestId - Optional request ID
     */
    async getBooking(params, requestId) {
        return this.request("/api/flight/getBooking", params, requestId);
    }
}

export const insuranceService = new InsuranceService();
