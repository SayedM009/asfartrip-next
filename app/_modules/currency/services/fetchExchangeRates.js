export async function fetchExchangeRates(
    fromCurrency,
    toCurrency,
    retryCount = 0
) {
    const MAX_RETRIES = 1;

    try {
        const res = await fetch(`/api/exchange-rates`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ from: fromCurrency, to: toCurrency }),
        });

        if (!res.ok) {
            if (retryCount < MAX_RETRIES) {
                return await fetchExchangeRates(
                    fromCurrency,
                    toCurrency,
                    retryCount + 1
                );
            }
            throw new Error("Failed to fetch exchange rates after retries");
        }

        const data = await res.json();
        return data.rate;
    } catch (error) {
        if (retryCount < MAX_RETRIES) {
            return await fetchExchangeRates(
                fromCurrency,
                toCurrency,
                retryCount + 1
            );
        }
        throw error;
    }
}
