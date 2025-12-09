"use client";

import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * WegoSearchButton - CTA button with validation state
 *
 * Wego-style prominent search button.
 * Disabled when form is invalid.
 */
export default function WegoSearchButton({ onSearch, isValid }) {
    const t = useTranslations("Flight");

    return (
        <Button
            onClick={onSearch}
            disabled={!isValid}
            className="w-full h-14 bg-accent-500 hover:bg-accent-600 text-white font-bold text-base rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
            <Search className="w-5 h-5 mr-2" />
            {t("operations.search")}
        </Button>
    );
}
