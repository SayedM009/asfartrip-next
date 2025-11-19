import { fetchExchangeRates } from "./fetchExchangeRates";
import { saveRateToCookie, getRateFromCookie } from "./cookies";

export async function getExchangeRate(fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return 1;

    const cached = getRateFromCookie(fromCurrency, toCurrency);
    if (cached !== null) return cached;

    const rate = await fetchExchangeRates(fromCurrency, toCurrency);

    if (rate) {
        saveRateToCookie(fromCurrency, toCurrency, rate);
        return rate;
    }

    throw new Error("No rate returned from API");
}
