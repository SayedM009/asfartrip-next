// _hooks/useCurrency.js
"use client";

import { useEffect, useState, useCallback } from "react";
import { useFormatter } from "next-intl";

export function useCurrency() {
    const [currency, setCurrency] = useState("AED");
    const [rates, setRates] = useState({});
    const format = useFormatter?.() ?? null;

    // جلب أسعار الصرف مرة واحدة
    // useEffect(() => {
    //     if (typeof window === "undefined") return;

    //     // لو فيه عملة محفوظة في localStorage استخدمها
    //     const savedCurrency = localStorage.getItem("currency");
    //     setCurrency(savedCurrency ?? "AED");

    //     let cancelled = false;

    //     (async () => {
    //         try {
    //             const res = await fetch(
    //                 `https://api.exchangerate.host/live?access_key=53c3379e98b93abccccbbbb4cfa7f3ce&base=AED`
    //             );
    //             const data = await res.json();
    //             if (!cancelled) setRates(data.quotes || {});
    //         } catch (err) {
    //             console.error("Failed to load currency rates", err);
    //         }
    //     })();

    //     return () => {
    //         cancelled = true;
    //     };
    // }, []);

    // تغيير العملة
    const changeCurrency = useCallback(
        (newCurrency) => {
            if (!newCurrency || newCurrency === currency) return;
            setCurrency(newCurrency);
            localStorage.setItem("currency", newCurrency);
        },
        [currency]
    );

    // دالة التحويل
    // const convert = useCallback(
    //     (amount) => {
    //         const num = Number(amount) || 0;
    //         const rate = rates["USD" + currency] ?? 1;
    //         return num * rate;
    //     },
    //     [rates, currency]
    // );

    // دالة التنسيق للعرض
    // const formatCurrency = useCallback(
    //     (amount) => {
    //         const converted = convert(amount);
    //         if (format && typeof format.number === "function") {
    //             return format.number(converted, {
    //                 style: "currency",
    //                 currency,
    //             });
    //         }

    //         return new Intl.NumberFormat(undefined, {
    //             style: "currency",
    //             currency,
    //         }).format(converted);
    //     },
    //     [convert, format, currency]
    // );

    return { currency, changeCurrency, rates };
}
