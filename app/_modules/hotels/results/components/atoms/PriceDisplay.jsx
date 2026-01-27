"use client";

import { useCurrency } from "@/app/_modules/currency/hooks/useCurrency";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

/**
 * Price display component with discount support
 * @param {Object} props
 * @param {number} props.price - Current price
 * @param {number} props.originalPrice - Price before discount (optional)
 * @param {number} props.discountPercent - Discount percentage (optional)
 * @param {number} props.nights - Number of nights
 * @param {string} props.currency - Currency code
 */
export default function PriceDisplay({
    price,
    originalPrice,
    discountPercent,
    nights = 1,
    rooms = 1,
    currency = "AED",
}) {
    const { formatPrice, convertPrice, currentCurrency } = useCurrency();
    const { theme } = useTheme();

    const t = useTranslations("Hotels.results");
    const isDark = theme === "dark";
    const hasDiscount = originalPrice && discountPercent > 0;
    const totalPrice = price * nights * rooms;

    return (
        <div className="flex flex-col items-end gap-0.5">
            {/* Discount badge */}
            {hasDiscount && (
                <div className="flex items-center gap-2">
                    <span className="text-xs bg-[#d81e60] text-white px-1.5 py-0.5 rounded font-medium">
                        -{10}%
                    </span>
                </div>
            )}

            {/* Current price per night */}
            <div className="flex items-center gap-2">
                {hasDiscount && (
                    <span className="text-sm text-muted-foreground line-through">
                        {convertPrice(originalPrice)}
                        <span className="ml-1">{currentCurrency}</span>
                    </span>
                )}
                <span className="text-2xl font-extrabold  dark:text-white hidden md:block">
                    {formatPrice(price, isDark ? "white" : "black", "20")}
                </span>
                <span className="text-2xl font-extrabold text-accent-500  dark:text-accent-500 md:hidden">
                    {formatPrice(price, "orange")}
                </span>
            </div>

            {/* Total price */}
            <div className="text-xs text-muted-foreground">
                <p className="flex items-center gap-1">
                    {t("total")}:
                    <span className="font-semibold text-black dark:text-white">
                        {formatPrice(
                            totalPrice,
                            isDark ? "white" : "black",
                            "10",
                        )}
                    </span>
                </p>
                <p className="flex items-center justify-end gap-1">
                    {Number(rooms) > 1
                        ? rooms + " " + t("rooms")
                        : rooms + " " + t("room")}{" "}
                    x{" "}
                    {Number(nights) > 1
                        ? nights + " " + t("nights")
                        : nights + " " + t("night")}
                </p>
            </div>
            {/* {nights > 1 && (
                
            )} */}
        </div>
    );
}
