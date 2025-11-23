"use client";

import { Button } from "@/components/ui/button";
import { useCurrency } from "@/app/_modules/currency/hooks/useCurrency";

export default function SortOptionCard({
    label,
    durationText,
    price,
    active,
    onClick,
    activeColor,
    textColor,
}) {
    const { formatPrice } = useCurrency();

    return (
        <button
            onClick={onClick}
            className={`w-full flex justify-between items-center px-4 py-3 border rounded-xl uppercase
                ${
                    active
                        ? `${activeColor} text-white`
                        : `bg-transparent ${textColor}`
                }
            `}
        >
            <div className="text-left">
                <p className="font-semibold">{label}</p>
                <p className="text-xs">{durationText}</p>
            </div>

            <div className="font-bold">{formatPrice(price)}</div>
        </button>
    );
}
