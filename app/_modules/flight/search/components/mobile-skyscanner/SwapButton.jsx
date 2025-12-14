"use client";

import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SwapButton({ onSwap }) {
    const t = useTranslations("Flight");
    const [rotationCount, setRotationCount] = useState(0);

    const handleSwap = () => {
        setRotationCount((prev) => prev + 1);
        onSwap();
    };

    // Calculate rotation: 180° for each click
    const rotationDegrees = rotationCount * 180;

    return (
        <button
            type="button"
            onClick={handleSwap}
            // className="absolute right-4 rtl:left-4 rtl:right-auto top-1/2 -translate-y-1/2 w-7 h-7  rounded-full flex items-center justify-center shadow-lg dark:bg-[#84E8FF] hover:bg-[#00B8C9] transition-colors z-10 border bg-background"
            className="absolute right-4 rtl:left-4 rtl:right-auto top-1/2 -translate-y-1/2 w-7 h-7  rounded-full flex items-center justify-center shadow-lg bg-accent-500 hover:bg-[#00B8C9] transition-colors z-10 border"
            aria-label={t("swap_locations") || "Swap locations"}
        >
            <ArrowUpDown
                // className="w-4 h-4 text-[#05203C] transition-transform duration-300"
                className="w-4 h-4 text-white transition-transform duration-300"
                style={{ transform: `rotate(${rotationDegrees}deg)` }}
            />
        </button>
    );
}
