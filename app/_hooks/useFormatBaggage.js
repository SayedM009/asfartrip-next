"use client";
import { useTranslations, useLocale } from "next-intl";

export function useFormatBaggage() {
    const t = useTranslations("Flight");
    const locale = useLocale?.() || "en";

    const isArabic = String(locale).toLowerCase().startsWith("ar");

    function normalize(s) {
        return String(s || "")
            .replace(/,/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function isZeroLike(s) {
        const txt = normalize(s).toLowerCase();
        return (
            txt === "0" ||
            txt === "0.0" ||
            /numberofpieces\s*0/i.test(txt) ||
            /kilograms?\s*0/i.test(txt)
        );
    }

    function isNoBaggage(s) {
        const txt = normalize(s).toLowerCase();
        return (
            txt === "" ||
            txt.includes("no baggage") ||
            txt === "none" ||
            txt === "no" ||
            isZeroLike(txt)
        );
    }

    function pieceWord(n) {
        if (isArabic) {
            return n === 1 ? t("baggage.piece") : t("baggage.pieces");
        }
        return n === 1 ? t("baggage.piece") : t("baggage.pieces");
    }

    function kgWord() {
        return t("baggage.Kilograms");
    }

    function formatBaggage(input) {
        if (!input || isNoBaggage(input)) {
            return t("booking.no_baggage");
        }

        let text = normalize(input);

        const weightMatch =
            text.match(/(\d+(?:\.\d+)?)\s*(kg|kgs?|kilogram(?:s)?)/i) || null;

        let pieceMatch =
            text.match(/(\d+)\s*(piece|pieces|pcs?|pc|bag|bags)/i) || null;

        if (!pieceMatch) {
            const totalIn = text.match(/total\s*in\s*(\d+)\s*piece/i);
            if (totalIn) {
                pieceMatch = [totalIn[0], totalIn[1], "piece"];
            }
        }

        if (!pieceMatch) {
            const nop = text.match(/numberofpieces\s*(\d+)/i);
            if (nop) {
                pieceMatch = [nop[0], nop[1], "piece"];
            }
        }

        let altWeight = null;
        if (!weightMatch) {
            altWeight = text.match(/kilograms?\s*(\d+(?:\.\d+)?)/i);
        }

        const parts = [];

        if (weightMatch) {
            const w = weightMatch[1];
            parts.push(`${w} ${kgWord()}`);
        } else if (altWeight) {
            const w = altWeight[1];
            if (Number(w) > 0) parts.push(`${w} ${kgWord()}`);
        }

        // ثم القطع
        if (pieceMatch) {
            const p = parseInt(pieceMatch[1], 10);
            if (!isNaN(p) && p > 0) {
                parts.push(`${p} ${pieceWord(p)}`);
            }
        }

        if (parts.length > 0) {
            return parts.join(" ");
        }

        text = text
            .replace(/NumberOfPieces/gi, t("baggage.piece"))
            .replace(/Kilograms/gi, kgWord());

        const fallback =
            text.match(/(\d+)\s*(\D+)/) || text.match(/(\D+)\s*(\d+)/);
        if (fallback) {
            let number, word;
            if (/\d+/.test(fallback[1])) {
                number = fallback[1];
                word = fallback[2].trim();
            } else {
                number = fallback[2];
                word = fallback[1].trim();
            }

            if (/^piece/i.test(word)) {
                word = pieceWord(Number(number) || 0);
            } else if (/^kg|^kilogram/i.test(word)) {
                word = kgWord();
            }
            return `${number} ${word}`;
        }

        return text;
    }

    return { formatBaggage };
}

// "use client";
// import { useTranslations } from "next-intl";

// export function useFormatBaggage() {
//     const t = useTranslations("Flight");

//     function formatBaggage(baggage) {
//         if (!baggage) return t("baggage.not_included");

//         let text = String(baggage).trim();

//         // 🟥 أي حالة فيها صفر تعتبر "غير متضمنة"
//         if (
//             text === "0" ||
//             text === "0.0" ||
//             /NumberOfPieces\s*0/i.test(text) ||
//             /Kilograms\s*0/i.test(text)
//         ) {
//             return t("baggage.not_included");
//         }

//         // 🟦 استبدال المصطلحات بالترجمة
//         text = text
//             .replace(/NumberOfPieces/i, t("baggage.piece"))
//             .replace(/Kilograms/i, t("baggage.Kilograms"));

//         // 🟩 نبحث عن رقم + كلمة أو كلمة + رقم
//         const match =
//             text.match(/(\d+)\s*(\D+)/) || text.match(/(\D+)\s*(\d+)/);

//         if (match) {
//             let number, word;

//             if (/\d+/.test(match[1])) {
//                 number = match[1];
//                 word = match[2].trim();
//             } else {
//                 number = match[2];
//                 word = match[1].trim();
//             }

//             if (word.toLowerCase().startsWith("piece")) {
//                 word =
//                     Number(number) > 1
//                         ? t("baggage.pieces")
//                         : t("baggage.piece");
//             }

//             return `${number} ${word}`;
//         }

//         return text;
//     }

//     return { formatBaggage };
// }
