"use client";

import { create } from "zustand";
import Image from "next/image";

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
            } catch {
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

    const rate = await fetchExchangeRates(fromCurrency, toCurrency);
    if (rate) {
        saveRateToCookie(fromCurrency, toCurrency, rate);
        return rate;
    }
    throw new Error("No rate returned from API");
}

// ============================================
// Zustand Store
// ============================================
export const useCurrencyStore = create((set, get) => ({
    baseCurrency: "AED",
    currentCurrency: "AED",
    exchangeRate: 1,
    isLoading: false,
    error: null,

    // استرجاع العملة المحفوظة من localStorage (لو حابب تناديه مرة في root)
    initCurrency: () => {
        if (typeof window === "undefined") return;
        const savedCurrency = localStorage.getItem("currency");
        if (savedCurrency && savedCurrency !== get().currentCurrency) {
            get().updateCurrency(savedCurrency);
        }
    },

    // تغيير العملة + تحميل السعر
    updateCurrency: async (newCurrency) => {
        console.log(`🔄 Currency changed: ${newCurrency}`);
        set({ currentCurrency: newCurrency });

        if (typeof window !== "undefined") {
            localStorage.setItem("currency", newCurrency);
        }

        const { baseCurrency } = get();

        if (newCurrency === baseCurrency) {
            set({ exchangeRate: 1, isLoading: false, error: null });
            return;
        }

        set({ isLoading: true, error: null });

        try {
            const rate = await getExchangeRate(baseCurrency, newCurrency);
            set({ exchangeRate: rate });
            console.log(
                `✅ Exchange rate updated: 1 ${baseCurrency} = ${rate} ${newCurrency}`
            );
        } catch (err) {
            console.error("❌ Failed to load exchange rate:", err);
            set({ error: err.message, exchangeRate: 1 });
        } finally {
            set({ isLoading: false });
        }
    },

    // تحويل السعر فقط
    convertPrice: (price) => {
        const { exchangeRate } = get();
        if (!price || isNaN(price)) return 0;
        return Math.ceil(parseFloat(price) * exchangeRate);
    },

    // ✅✅ نفس formatPrice القديم بالظبط ✅✅
    formatPrice: (price, color = "orange", size = 15, className = "") => {
        const { currentCurrency, convertPrice } = get();
        const converted = convertPrice(price);

        const currencySymbols = {
            USD: "$",
            EUR: "€",
            GBP: "£",
            CHF: "CHF",
            AED: "AED",
            SAR: "SAR",
        };

        const isImageCurrency =
            currentCurrency === "AED" || currentCurrency === "SAR";

        const iconSrc = `/currencies/${color}/${
            currentCurrency === "AED" ? "uae.svg" : "saudi.svg"
        }`;

        return (
            <span
                className={`inline-flex items-center gap-1 font-semibold ${className}`}
            >
                <span>{converted.toLocaleString()}</span>
                {isImageCurrency ? (
                    <Image
                        src={iconSrc}
                        alt={currentCurrency}
                        width={size}
                        height={size}
                        priority={true}
                        className={`inline-block size-${size} `}
                    />
                ) : (
                    <span className="ml-1 text-sm font-medium">
                        {currencySymbols[currentCurrency] || currentCurrency}
                    </span>
                )}
            </span>
        );
    },
}));

export const useCurrency = useCurrencyStore;
