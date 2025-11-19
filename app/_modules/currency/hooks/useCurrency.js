import { useCurrencyStore } from "../store/useCurrencyStore";

export function useCurrency() {
    const {
        currentCurrency,
        baseCurrency,
        exchangeRate,
        isLoading,
        error,
        updateCurrency,
        convertPrice,
        formatPrice,
        initCurrency,
    } = useCurrencyStore();

    return {
        currentCurrency,
        baseCurrency,
        exchangeRate,
        isLoading,
        error,
        updateCurrency,
        convertPrice,
        formatPrice,
        initCurrency,
    };
}
