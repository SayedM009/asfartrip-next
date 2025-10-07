"use client";
import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";

// ============================================
// Function API Exchange Rates
// ============================================
async function fetchExchangeRates(fromCurrency, toCurrency, retryCount = 0) {
    const MAX_RETRIES = 1;

    try {
        const res = await fetch(`/api/exchange-rates`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: fromCurrency,
                to: toCurrency,
            }),
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

function saveRateToCookie(fromCurrency, toCurrency, rate) {
    const rateData = {
        rate: rate,
        timestamp: Date.now(),
        from: fromCurrency,
        to: toCurrency,
    };

    const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString();
    document.cookie = `exchange_rate_${fromCurrency}_${toCurrency}=${JSON.stringify(
        rateData
    )}; expires=${expires}; path=/; SameSite=Lax`;
}

function getRateFromCookie(fromCurrency, toCurrency) {
    const cookieName = `exchange_rate_${fromCurrency}_${toCurrency}=`;
    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(cookieName)) {
            try {
                const rateData = JSON.parse(
                    cookie.substring(cookieName.length)
                );

                if (!rateData.timestamp || !rateData.rate) return null;

                const hourInMs = 60 * 60 * 1000;
                const timePassed = Date.now() - rateData.timestamp;

                if (timePassed < hourInMs) return rateData.rate;
                return null;
            } catch (e) {
                return null;
            }
        }
    }
    return null;
}

async function getExchangeRate(fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return 1;

    const cachedRate = getRateFromCookie(fromCurrency, toCurrency);
    if (cachedRate !== null) return cachedRate;

    try {
        const rate = await fetchExchangeRates(fromCurrency, toCurrency);
        if (rate) {
            saveRateToCookie(fromCurrency, toCurrency, rate);
            return rate;
        }
        throw new Error("No rate returned from API");
    } catch (error) {
        console.error("❌ Error getting exchange rate:", error);
        throw error;
    }
}

// ============================================
// Currency Context
// ============================================
const CurrencyContext = createContext(undefined);

export function CurrencyProvider({ children, baseCurrency = "AED" }) {
    const [currentCurrency, setCurrentCurrency] = useState(baseCurrency);
    const [exchangeRate, setExchangeRate] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get the saved currency in localStorage
    useEffect(() => {
        const savedCurrency = localStorage.getItem("currency");
        if (savedCurrency && savedCurrency !== currentCurrency) {
            setCurrentCurrency(savedCurrency);
        }
    }, []);

    // Grap the exchange when change rate
    useEffect(() => {
        const loadExchangeRate = async () => {
            if (currentCurrency === baseCurrency) {
                setExchangeRate(1);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const rate = await getExchangeRate(
                    baseCurrency,
                    currentCurrency
                );
                setExchangeRate(rate);
                console.log(
                    `✅ Exchange rate updated: 1 ${baseCurrency} = ${rate} ${currentCurrency}`
                );
            } catch (err) {
                setError(err.message);
                setExchangeRate(1);
                console.error("❌ Failed to load exchange rate:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadExchangeRate();
    }, [currentCurrency, baseCurrency]);

    // Convert the Price only
    const convertPrice = useCallback(
        (price) => {
            if (!price || isNaN(price)) return 0;
            return Math.ceil(parseFloat(price) * exchangeRate);
        },
        [exchangeRate]
    );

    // Convert the price with currency
    const formatPrice = useCallback(
        (price) => {
            const converted = convertPrice(price);
            const currencySymbols = {
                USD: "$",
                EUR: "€",
                GBP: "£",
                CHF: "CHF",
                AED: "AED",
            };
            return `${
                currencySymbols[currentCurrency] || currentCurrency
            } ${converted}`;
        },
        [convertPrice, currentCurrency]
    );

    // دالة لتحديث العملة (مع broadcast للـ components)
    const updateCurrency = useCallback((newCurrency) => {
        console.log(`🔄 Currency changed: ${newCurrency}`);
        setCurrentCurrency(newCurrency);
        localStorage.setItem("currency", newCurrency);
    }, []);

    const value = {
        currentCurrency,
        exchangeRate,
        isLoading,
        error,
        convertPrice,
        formatPrice,
        updateCurrency,
        baseCurrency,
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
}

// Hook للاستخدام
export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error("useCurrency must be used within CurrencyProvider");
    }
    return context;
}

export default CurrencyContext;
