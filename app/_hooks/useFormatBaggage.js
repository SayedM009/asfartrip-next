"use client";
import { useTranslations } from "next-intl";

export function useFormatBaggage() {
    const t = useTranslations("Flight");

    function formatBaggage(baggage) {
        if (!baggage) return t("baggage.not_included");

        let text = String(baggage).trim();

        // 🟥 أي حالة فيها صفر تعتبر "غير متضمنة"
        if (
            text === "0" ||
            text === "0.0" ||
            /NumberOfPieces\s*0/i.test(text) ||
            /Kilograms\s*0/i.test(text)
        ) {
            return t("baggage.not_included");
        }

        // 🟦 استبدال المصطلحات بالترجمة
        text = text
            .replace(/NumberOfPieces/i, t("baggage.piece"))
            .replace(/Kilograms/i, t("baggage.Kilograms"));

        // 🟩 نبحث عن رقم + كلمة أو كلمة + رقم
        const match =
            text.match(/(\d+)\s*(\D+)/) || text.match(/(\D+)\s*(\d+)/);

        if (match) {
            let number, word;

            if (/\d+/.test(match[1])) {
                number = match[1];
                word = match[2].trim();
            } else {
                number = match[2];
                word = match[1].trim();
            }

            if (word.toLowerCase().startsWith("piece")) {
                word =
                    Number(number) > 1
                        ? t("baggage.pieces")
                        : t("baggage.piece");
            }

            return `${number} ${word}`;
        }

        return text;
    }

    return { formatBaggage };
}
