export function validateResponse(response) {
    const { ok, status, data } = response;

    if (!ok || data?.error) {
        return { error: { message: data?.error || `Server error (${status})`, status, type: "API_ERROR" }};
    }

    if (!Array.isArray(data)) {
        return { error: { message: "Unexpected response format", type: "INVALID_RESPONSE" }};
    }

    if (data.length === 0) {
        return { error: { message: "No flights found", type: "NO_RESULTS" }};
    }

    return { data };
}
