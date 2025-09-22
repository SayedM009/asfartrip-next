export const searchFlights = async (params) => {
    // Base data for both one-way and roundtrip
    const requestData = {
        origin: params.origin,
        destination: params.destination,
        depart_date: params.depart_date,
        ADT: params.ADT || 1,
        CHD: params.CHD || 0,
        INF: params.INF || 0,
        class: params.class || "Economy",
        type: params.type || "O",
    };

    // Add return_date only if roundtrip
    if (params.type === "R" && params.return_date) {
        requestData.return_date = params.return_date;
    }

    const data = qs.stringify(requestData);
    let response = await apiClient.post("/api/flight/search", data);
    if (
        response?.data?.error &&
        response.data.error === "Credentials don't match or missing privileges."
    ) {
        clearToken();
        //need to make same search again
        response = await apiClient.post("/api/flight/search", data);
    }

    return response.data;
};
