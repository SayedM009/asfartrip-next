"use client";
import { useTranslations, useLocale } from "next-intl";

export function useFormatBaggage() {
    const t = useTranslations("Flight");
    const locale = useLocale?.() || "en";
    const isArabic = locale.toLowerCase().startsWith("ar");

    const normalize = (val) =>
        String(val || "")
            .replace(/,/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .toLowerCase();

    const isZero = (txt) =>
        ["0", "0.0"].includes(txt) ||
        /numberofpieces\s*0/i.test(txt) ||
        /kilograms?\s*0/i.test(txt);

    const isNoBaggage = (txt) =>
        !txt ||
        txt.includes("no baggage") ||
        txt === "none" ||
        txt === "no" ||
        isZero(txt);

    // كلمة "قطعة / قطع"
    const pieceLabel = (count) =>
        isArabic
            ? count === 1
                ? t("baggage.piece")
                : t("baggage.pieces")
            : count === 1
            ? t("baggage.piece")
            : t("baggage.pieces");

    const weightLabel = () => t("baggage.Kilograms");

    function formatBaggage(inputRaw) {
        const raw = normalize(inputRaw);

        if (isNoBaggage(raw)) {
            return t("booking.no_baggage");
        }

        let weight = null;
        let pieces = null;

        // ------- Extract weight -------
        const weightMatch =
            raw.match(/(\d+(?:\.\d+)?)\s*(kg|kgs?|kilogram(?:s)?)/i) ||
            raw.match(/kilograms?\s*(\d+(?:\.\d+)?)/i);

        if (weightMatch) {
            const w = weightMatch[1];
            if (Number(w) > 0) weight = `${w} ${weightLabel()}`;
        }

        // ------- Extract pieces -------
        const pieceMatch =
            raw.match(/(\d+)\s*(piece|pieces|pcs?|pc|bag|bags)/i) ||
            raw.match(/numberofpieces\s*(\d+)/i) ||
            raw.match(/total\s*in\s*(\d+)\s*piece/i);

        if (pieceMatch) {
            const count = Number(pieceMatch[1]);
            if (count > 0) pieces = `${count} ${pieceLabel(count)}`;
        }

        // ------- Combine -------
        if (weight && pieces) return `${weight} • ${pieces}`;
        if (weight) return weight;
        if (pieces) return pieces;

        // ------- Fallback (rare cases) -------
        const fallback = raw.match(/(\d+)\s*(\D+)/);
        if (fallback) {
            const num = fallback[1];
            let word = fallback[2].trim();

            if (/^piece/i.test(word)) word = pieceLabel(Number(num));
            if (/^(kg|kilogram)/i.test(word)) word = weightLabel();

            return `${num} ${word}`;
        }

        // Return normalized raw string if all else fails
        return raw;
    }

    return { formatBaggage };
}
