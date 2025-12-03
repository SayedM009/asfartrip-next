import { create } from "zustand";
import { getExchangeRate } from "../services/getExchangeRate";
import Image from "next/image";

export const useCurrencyStore = create((set, get) => ({
    baseCurrency: "AED",
    currentCurrency: "AED",
    exchangeRate: 1,
    isLoading: false,
    error: null,

    initCurrency: () => {
        if (typeof window === "undefined") return;
        const saved = localStorage.getItem("currency");
        if (saved && saved !== get().currentCurrency) {
            get().updateCurrency(saved);
        }
    },

    updateCurrency: async (newCurrency) => {
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
        } catch (err) {
            set({ error: err.message, exchangeRate: 1 });
        } finally {
            set({ isLoading: false });
        }
    },

    convertPrice: (price) => {
        const { exchangeRate } = get();
        if (!price || isNaN(price)) return 0;
        return Math.ceil(parseFloat(price) * exchangeRate);
    },

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

        const iconSrc = `/currencies/${color}/${currentCurrency === "AED" ? "uae.svg" : "saudi.svg"
            }`;

        return (
            <span
                className={`inline-flex items-center gap-1 font-semibold ${className}`}
            >
                <span>{converted.toLocaleString('en-US')}</span>
                {isImageCurrency ? (
                    <Image
                        src={iconSrc}
                        alt={currentCurrency}
                        width={size}
                        height={size}
                        priority
                    />
                ) : (
                    <span className="ml-1">
                        {currencySymbols[currentCurrency] || currentCurrency}
                    </span>
                )}
            </span>
        );
    },
}));

export const useCurrency = useCurrencyStore;
