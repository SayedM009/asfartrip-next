"use client";

import { useCurrency } from "@/app/_modules/currency/hooks/useCurrency";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

/**
 * Price display component for hotel details page
 * Shows old price (strikethrough) + current price + Select Rooms button
 */
export default function DetailsPriceDisplay({
    price,
    originalPrice,
    onSelectRooms,
}) {
    const { formatPrice, convertPrice, currentCurrency } = useCurrency();
    const t = useTranslations("Hotels.details");

    const hasDiscount = originalPrice && originalPrice > price;

    const scrollToRooms = () => {
        const roomsSection = document.getElementById("rooms-section");
        if (roomsSection) {
            roomsSection.scrollIntoView({ behavior: "smooth" });
        }
        onSelectRooms?.();
    };

    return (
        <div className="flex items-center gap-4">
            {/* Price Section */}
            <div className="flex items-center gap-2">
                {/* Old price with strikethrough */}
                {hasDiscount && (
                    <span className="text-sm text-muted-foreground line-through">
                        {currentCurrency} {convertPrice(originalPrice)}
                    </span>
                )}
                {/* Current price */}
                <span className="text-xl md:text-3xl font-bold text-primary">
                    {formatPrice(price)}
                </span>
            </div>

            {/* Select Rooms Button */}
            <Button
                onClick={scrollToRooms}
                className="bg-accent-600 hover:bg-accent-700 text-white text-xl font-bold px-6 py-6 cursor-pointer rounded"
            >
                {t("select_room")}
            </Button>
        </div>
    );
}
