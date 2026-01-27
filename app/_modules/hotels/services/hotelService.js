import { getValidToken, clearAPIToken } from "@/app/_libs/token-manager";

const BASE_URL = process.env.API_BASE_URL;

class HotelService {
    /**
     * Generic GET request handler with token management and retry logic
     * @param {string} endpoint - API endpoint
     * @param {Object} params - Query parameters
     * @param {string} requestId - Request ID for logging
     * @param {number} timeout - Request timeout in ms (default 30000)
     * @returns {Promise<Object>} - API response data
     */
    async requestGet(endpoint, params, requestId = "unknown", timeout = 30000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            let token = await getValidToken();
            const username = process.env.TP_USERNAME;
            const password = process.env.TP_PASSWORD;
            const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

            const queryParams = new URLSearchParams({ ...params, api_token: token });
            const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;

            console.log(
                ` [${new Date().toISOString()}] [${requestId}] Sending GET request to ${endpoint}`
            );

            let response = await fetch(url, {
                method: "GET",
                headers: { Authorization: `Basic ${basicAuth}` },
                cache: "no-store",
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            // Handle 401/403 (Token Expired/Invalid)
            if (response.status === 401 || response.status === 403) {
                console.warn(` [${requestId}] Auth failed. Retrying with fresh token...`);
                await clearAPIToken();
                token = await getValidToken();

                const retryController = new AbortController();
                const retryTimeoutId = setTimeout(() => retryController.abort(), timeout);
                const retryQueryParams = new URLSearchParams({ ...params, api_token: token });
                const retryUrl = `${BASE_URL}${endpoint}?${retryQueryParams.toString()}`;

                try {
                    response = await fetch(retryUrl, {
                        method: "GET",
                        headers: { Authorization: `Basic ${basicAuth}` },
                        cache: "no-store",
                        signal: retryController.signal,
                    });
                    clearTimeout(retryTimeoutId);
                } catch (retryError) {
                    clearTimeout(retryTimeoutId);
                    throw retryError;
                }
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`[${requestId}] API Error: ${response.status}`, errorText);
                throw new Error(`API Error: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === "AbortError") {
                throw new Error(`Request timeout after ${timeout}ms`);
            }
            console.error(` [${requestId}] HotelService Error:`, error.message);
            throw error;
        }
    }

    /**
     * Generic POST request handler with token management and retry logic
     * @param {string} endpoint - API endpoint
     * @param {Object} payload - Request body (JSON)
     * @param {string} requestId - Request ID for logging
     * @param {number} timeout - Request timeout in ms (default 60000 for availability)
     * @returns {Promise<Object>} - API response data
     */
    async requestPost(endpoint, payload, requestId = "unknown", timeout = 60000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            let token = await getValidToken();
            const username = process.env.TP_USERNAME;
            const password = process.env.TP_PASSWORD;
            const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

            console.log(
                ` [${new Date().toISOString()}] [${requestId}] Sending POST request to ${endpoint}`
            );

            // Add api_token to payload
            const bodyWithToken = { ...payload, api_token: token };

            let response = await fetch(`${BASE_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${basicAuth}`,
                },
                body: JSON.stringify(bodyWithToken),
                cache: "no-store",
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            // Handle 401/403 (Token Expired/Invalid)
            if (response.status === 401 || response.status === 403) {
                console.warn(` [${requestId}] Auth failed. Retrying with fresh token...`);
                await clearAPIToken();
                token = await getValidToken();

                const retryController = new AbortController();
                const retryTimeoutId = setTimeout(() => retryController.abort(), timeout);
                const retryBodyWithToken = { ...payload, api_token: token };

                try {
                    response = await fetch(`${BASE_URL}${endpoint}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Basic ${basicAuth}`,
                        },
                        body: JSON.stringify(retryBodyWithToken),
                        cache: "no-store",
                        signal: retryController.signal,
                    });
                    clearTimeout(retryTimeoutId);
                } catch (retryError) {
                    clearTimeout(retryTimeoutId);
                    throw retryError;
                }
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`[${requestId}] API Error: ${response.status}`, errorText);
                throw new Error(`API Error: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === "AbortError") {
                throw new Error(`Request timeout after ${timeout}ms`);
            }
            console.error(` [${requestId}] HotelService Error:`, error.message);
            throw error;
        }
    }

    /**
     * Search for hotels by term (city, hotel name, etc.)
     * @param {string} term - Search term
     * @param {string} requestId - Optional request ID
     */
    async searchHotelTerm(term, requestId) {
        return this.requestGet("/api/hotel/v2/SearchHotelTerm", { term }, requestId);
    }

    /**
     * Get hotel availability
     * @param {Object} payload - Availability request payload
     * @param {string} payload.city - City name
     * @param {string} payload.check_in - Check-in date (yyyy-MM-dd)
     * @param {string} payload.check_out - Check-out date (yyyy-MM-dd)
     * @param {string} payload.nationality - Country code (e.g., 'AE')
     * @param {Array} payload.rooms - Array of rooms [{adults: number, childs: number[]}]
     * @param {string} payload.currency - Currency code (e.g., 'AED')
     * @param {string} [payload.location_id] - Location ID (if searching by location)
     * @param {string} [payload.hotel_id] - Hotel ID (if searching specific hotel)
     * @param {string} requestId - Optional request ID
     */
    async getHotelAvailability(payload, requestId) {
        return this.requestPost("/api/hotel/v2/HotelsAvailibility", payload, requestId, 90000);
    }

    /**
     * Get recommended hotels for a city
     * @param {string} city - City name
     * @param {string} country - Country code (e.g., 'AE')
     * @param {string} requestId - Optional request ID
     */
    async getRecommendedHotels(city, country, requestId) {
        return this.requestGet("/api/hotel/v2/get_recommended_hotels", { city, country }, requestId);
    }
}

export const hotelService = new HotelService();
