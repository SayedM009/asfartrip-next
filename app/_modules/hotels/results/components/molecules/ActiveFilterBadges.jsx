"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

/**
 * Active filter badges with remove functionality
 * @param {Object} props
 * @param {Object} props.filters - Current filter state
 * @param {Function} props.onRemove - Callback to remove a filter
 * @param {Function} props.onReset - Callback to reset all filters
 */
export default function ActiveFilterBadges({ filters, onRemove, onReset }) {
    const t = useTranslations("Hotels.results");

    const badges = [];

    // Price range badge
    if (
        filters.priceRange &&
        (filters.priceRange.min > 0 || filters.priceRange.max < Infinity)
    ) {
        const label =
            filters.priceRange.max === Infinity
                ? `${filters.priceRange.min}+`
                : `${filters.priceRange.min} - ${filters.priceRange.max}`;
        badges.push({
            type: "priceRange",
            value: null,
            label: `${t("price_range")}: ${label}`,
        });
    }

    // Star rating badges
    if (filters.starRatings && filters.starRatings.length > 0) {
        filters.starRatings.forEach((rating) => {
            badges.push({
                type: "starRating",
                value: rating,
                label: `${rating}★`,
            });
        });
    }

    // Property type badges
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
        filters.propertyTypes.forEach((type) => {
            badges.push({
                type: "propertyType",
                value: type,
                label: type,
            });
        });
    }

    if (badges.length === 0) return null;

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {badges.map((badge, index) => (
                <div
                    key={`${badge.type}-${badge.value || index}`}
                    className="flex items-center gap-1 bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-300 px-2 py-1 rounded-full text-sm"
                >
                    <span>{badge.label}</span>
                    <button
                        onClick={() => onRemove(badge.type, badge.value)}
                        className="hover:bg-accent-100 dark:hover:bg-accent-800 rounded-full p-0.5"
                        aria-label={`Remove ${badge.label} filter`}
                    >
                        <X className="size-3" />
                    </button>
                </div>
            ))}

            {/* Reset all button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="text-xs text-muted-foreground hover:text-foreground"
            >
                {t("clear_filters")}
            </Button>
        </div>
    );
}
