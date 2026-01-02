"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * FloatingSearchCTA - Skyscanner-style floating search button
 *
 * Features:
 * - Circular button with search icon
 * - Positioned fixed at bottom left
 * - Cyan/teal Skyscanner accent color
 * - Disabled state when search is invalid
 */
export default function FloatingSearchCTA({ onSearch, isValid }) {
    const t = useTranslations("Flight");

    return (
        <button
            type="button"
            onClick={onSearch}
            disabled={!isValid}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all  ${
                isValid
                    ? "bg-accent-500 hover:bg-accent-600 cursor-pointer"
                    : "bg-gray-600 cursor-not-allowed opacity-50"
            }`}
            aria-label={t("operations.search") || "Search flights"}
        >
            {/* <Search className="w-6 h-6 text-[#05203C]" /> */}
            <Search className="w-6 h-6 text-white" />
        </button>
    );
}
