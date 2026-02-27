"use client";

import { CalendarDays, Moon } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Check-in / check-out dates + nights count card
 */
export default function StayDatesCard({ searchParams }) {
    const t = useTranslations("Hotels.booking");

    if (!searchParams?.checkIn) return null;

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="space-y-2">
            <h4 className="text-sm font-semibold text-primary-600 dark:text-primary-200">
                {t("stay_dates")}
            </h4>

            <div className="flex items-center justify-between">
                <div className="flex items-start gap-2 text-sm">
                    <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">{t("check_in")}</span>
                        <span className="font-medium">{formatDate(searchParams.checkIn)}</span>
                    </div>
                </div>

                <div className="flex items-start gap-2 text-sm">
                    <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">{t("check_out")}</span>
                        <span className="font-medium">{formatDate(searchParams.checkOut)}</span>
                    </div>
                </div>
            </div>



            {searchParams.nights && (
                <div className="flex items-center gap-2 text-sm">
                    <Moon className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">
                        {searchParams.nights} {searchParams.nights === 1 ? t("night") : t("nights")}
                    </span>
                </div>
            )}
        </div>
    );
}
