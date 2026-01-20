import { getValidToken, clearAPIToken } from "../_libs/token-manager";

const BASE_URL = process.env.API_BASE_URL;

class HotelService {
    /**
     * Generic GET request handler with token management and retry logic
     * @param {string} endpoint - API endpoint (e.g., '/api/hotel/v2/SearchHotelTerm')
     * @param {Object} params - Query parameters
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

            // 3. Build URL with query params
            const queryParams = new URLSearchParams({ ...params, api_token: token });
            const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;

            // Debug log
            console.log(
                ` [${new Date().toISOString()}] [${requestId}] Sending GET request to ${endpoint} with params:`,
                Object.keys({ ...params, api_token: "MASKED" })
            );

            // 4. Make GET request
            let response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Basic ${basicAuth}`,
                },
                cache: "no-store",
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            // 5. Handle 401/403 (Token Expired/Invalid)
            if (response.status === 401 || response.status === 403) {
                console.warn(
                    ` [${new Date().toISOString()}] [${requestId}] Auth failed (401/403). Retrying with fresh token...`
                );

                // Clear old token and force refresh
                await clearAPIToken();
                token = await getValidToken();

                // Retry request with new token
                const retryController = new AbortController();
                const retryTimeoutId = setTimeout(() => retryController.abort(), timeout);
                const retryQueryParams = new URLSearchParams({ ...params, api_token: token });
                const retryUrl = `${BASE_URL}${endpoint}?${retryQueryParams.toString()}`;

                try {
                    response = await fetch(retryUrl, {
                        method: "GET",
                        headers: {
                            Authorization: `Basic ${basicAuth}`,
                        },
                        cache: "no-store",
                        signal: retryController.signal,
                    });
                    clearTimeout(retryTimeoutId);
                } catch (retryError) {
                    clearTimeout(retryTimeoutId);
                    throw retryError;
                }
            }

            // 6. Handle other errors
            if (!response.ok) {
                const errorText = await response.text();
                console.error(
                    `[${new Date().toISOString()}] [${requestId}] API Error: ${response.status} ${response.statusText}`,
                    errorText
                );
                throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
            }

            // 7. Return JSON
            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === "AbortError") {
                console.error(` [${new Date().toISOString()}] [${requestId}] Request timed out after ${timeout}ms`);
                throw new Error(`Request timeout after ${timeout}ms`);
            }

            console.error(
                ` [${new Date().toISOString()}] [${requestId}] HotelService Error:`,
                error.message
            );
            throw error;
        }
    }

    /**
     * Search for hotels by term (city, hotel name, etc.)
     * @param {string} term - Search term
     * @param {string} requestId - Optional request ID
     * @returns {Promise<Object>} - Returns locations and hotels matching the term
     */
    async searchHotelTerm(term, requestId) {
        return this.request("/api/hotel/v2/SearchHotelTerm", { term }, requestId);
    }
}

export const hotelService = new HotelService();
