// app/_hooks/useCurrencyConverter.js
"use client";
import { useState, useEffect, useCallback } from "react";

// ============================================
// دالة لجلب الـ rates من الـ API
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
                console.log("Retrying to fetch exchange rates...");
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
            console.log("Retrying due to error...");
            return await fetchExchangeRates(
                fromCurrency,
                toCurrency,
                retryCount + 1
            );
        }
        console.error("Failed to fetch exchange rates:", error);
        throw error;
    }
}

// ============================================
// دالة لحفظ الـ rate في الـ cookie
// ============================================
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

    console.log(`✅ Rate saved: ${fromCurrency} → ${toCurrency} = ${rate}`);
}

// ============================================
// دالة لجلب الـ rate من الـ cookie
// ============================================
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

                if (!rateData.timestamp || !rateData.rate) {
                    return null;
                }

                // تحقق من المدة (ساعة = 3600000 ميلي ثانية)
                const hourInMs = 60 * 60 * 1000;
                const timePassed = Date.now() - rateData.timestamp;

                if (timePassed < hourInMs) {
                    console.log(
                        `✅ Using cached rate: ${fromCurrency} → ${toCurrency} = ${rateData.rate}`
                    );
                    return rateData.rate;
                } else {
                    console.log(
                        `⚠️ Cached rate expired (${Math.round(
                            timePassed / 60000
                        )} minutes old)`
                    );
                    return null;
                }
            } catch (e) {
                console.error("Error parsing cookie:", e);
                return null;
            }
        }
    }

    return null;
}

// ============================================
// دالة رئيسية للحصول على الـ rate
// ============================================
async function getExchangeRate(fromCurrency, toCurrency) {
    // نفس العملة
    if (fromCurrency === toCurrency) {
        return 1;
    }

    // B - تحقق من الـ cookie أولاً
    const cachedRate = getRateFromCookie(fromCurrency, toCurrency);
    if (cachedRate !== null) {
        // B2 - المدة أقل من ساعة، استخدمها
        return cachedRate;
    }

    // A - لا يوجد rate في الـ cookie أو منتهي الصلاحية
    try {
        // A1 - جلب الـ rates من الـ API
        const rate = await fetchExchangeRates(fromCurrency, toCurrency);

        if (rate) {
            // A4 - خزنها في الـ cookie
            saveRateToCookie(fromCurrency, toCurrency, rate);
            // A5 - استخدمها
            return rate;
        } else {
            // A10 - فشل الجلب
            throw new Error("No rate returned from API");
        }
    } catch (error) {
        console.error("❌ Error getting exchange rate:", error);
        throw error;
    }
}

// ============================================
// Custom Hook لتحويل العملات
// ============================================
/**
 * @param {string} baseCurrency - العملة الأساسية (default: "AED")
 * @returns {object} - { convertPrice, formatPrice, currentCurrency, exchangeRate, isLoading, error, updateCurrency }
 */
export function useCurrencyConverter(baseCurrency = "AED") {
    const [currentCurrency, setCurrentCurrency] = useState(baseCurrency);
    const [exchangeRate, setExchangeRate] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // جلب العملة المحفوظة من localStorage
    useEffect(() => {
        const savedCurrency = localStorage.getItem("currency");
        if (savedCurrency) {
            setCurrentCurrency(savedCurrency);
        }
    }, []);

    // جلب exchange rate عند تغيير العملة
    useEffect(() => {
        const loadExchangeRate = async () => {
            if (currentCurrency === baseCurrency) {
                setExchangeRate(1);
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
            } catch (err) {
                setError(err.message);
                setExchangeRate(1); // fallback to 1
            } finally {
                setIsLoading(false);
            }
        };

        loadExchangeRate();
    }, [currentCurrency, baseCurrency]);

    // دالة لتحويل السعر
    const convertPrice = useCallback(
        (price) => {
            if (!price || isNaN(price)) return 0;
            return (parseFloat(price) * exchangeRate).toFixed(2);
        },
        [exchangeRate]
    );

    // دالة لتحويل السعر مع رمز العملة
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

    // دالة لتحديث العملة يدوياً
    const updateCurrency = useCallback((newCurrency) => {
        setCurrentCurrency(newCurrency);
        localStorage.setItem("currency", newCurrency);
    }, []);

    return {
        convertPrice, // دالة لتحويل السعر فقط
        formatPrice, // دالة لتحويل السعر مع رمز العملة
        currentCurrency, // العملة الحالية
        exchangeRate, // سعر الصرف الحالي
        isLoading, // حالة التحميل
        error, // رسالة الخطأ إن وجدت
        updateCurrency, // دالة لتحديث العملة
    };
}

export default useCurrencyConverter;
