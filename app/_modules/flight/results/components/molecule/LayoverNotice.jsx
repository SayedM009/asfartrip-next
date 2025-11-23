"use client";

import { Clock } from "lucide-react";
import { calculateLayoverTime } from "../../utils/flightTimeUtils";
import { useTranslations } from "next-intl";

export default function LayoverNotice({ segment, nextSegment }) {
    const t = useTranslations("Flight");

    return (
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                <Clock className="h-4 w-4" />
                <span className="font-medium">
                    {t(`dialog.layover`, {
                        city: segment.Destination,
                        time: calculateLayoverTime(
                            segment.ArrivalTime,
                            nextSegment.DepartureTime,
                            t
                        ),
                    })}
                </span>
            </div>

            <div className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                {t("baggage.recheck_baggage")}
            </div>
        </div>
    );
}
