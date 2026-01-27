"use client";

import { useTranslations } from "next-intl";
import { SearchX } from "lucide-react";

/**
 * No hotels found component (when API returns empty results)
 * Search modification is handled by MobileResultsHeader on mobile
 * and HotelSearch on desktop
 */
export default function NoHotelsFound() {
    const t = useTranslations("Hotels.results");

    return (
        <div className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center size-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
                <SearchX className="size-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
                {t("no_hotels_found")}
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {t("no_hotels_found_desc")}
            </p>
        </div>
    );
}
