"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Clock, DollarSign, PlaneTakeoff } from "lucide-react";

export default function DesktopSortBar({
    sortBy,
    setSortBy,
    cheapestPrice,
    fastestDuration,
    earliestTime,
}) {
    const t = useTranslations("Flight");

    const formatDuration = (dur) => {
        if (!dur) return "";
        return `${dur.h}${t("sort.h")} ${dur.m}${t("sort.m")}`;
    };

    const options = [
        {
            id: "price",
            label: t("sort.cheapest"),
            info: cheapestPrice,
            icon: DollarSign,
        },
        {
            id: "duration",
            label: t("sort.fastest"),
            info: formatDuration(fastestDuration),
            icon: Clock,
        },
        {
            id: "earliest",
            label: t("sort.earliest"),
            info: earliestTime,
            icon: PlaneTakeoff,
        },
    ];

    return (
        <div className="hidden md:grid grid-cols-3 gap-3 mb-5">
            {options.map((option) => {
                const isActive = sortBy === option.id;
                const Icon = option.icon;

                return (
                    <button
                        key={option.id}
                        onClick={() => setSortBy(option.id)}
                        className={cn(
                            "relative flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-200 group",
                            isActive
                                ? "border-accent-500 bg-accent-50 dark:bg-accent-900/10"
                                : "border-transparent bg-white dark:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700 shadow-sm"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <div
                                className={cn(
                                    "p-1.5 rounded-full",
                                    isActive
                                        ? "bg-accent-100 text-accent-600 dark:bg-accent-900/30"
                                        : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 group-hover:bg-gray-200"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                            </div>
                            <span
                                className={cn(
                                    "font-semibold text-sm",
                                    isActive
                                        ? "text-accent-700 dark:text-accent-400"
                                        : "text-gray-700 dark:text-gray-300"
                                )}
                            >
                                {option.label}
                            </span>
                        </div>

                        {option.info && (
                            <span
                                className={cn(
                                    "text-sm font-bold",
                                    isActive
                                        ? "text-gray-900 dark:text-white"
                                        : "text-gray-600 dark:text-gray-400"
                                )}
                            >
                                {option.info}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
