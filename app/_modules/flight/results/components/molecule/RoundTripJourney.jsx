"use client";

import SingleJourney from "./SingleJourney";
import { Plane, ArrowRight } from "lucide-react";

export default function RoundTripJourney({
    onward,
    returnJourney,
    t,
    formatDate,
}) {
    return (
        <div>
            {/* Outbound */}
            <div className="px-4 py-1 text-xs text-muted-foreground flex items-center gap-1">
                <Plane className="h-3 w-3" /> {t("outbound")}
            </div>
            <SingleJourney
                segments={onward.segments}
                t={t}
                formatDate={formatDate}
            />

            {/* Divider */}
            <div className="border-t border-border/30 my-1" />

            {/* Return */}
            <div className="px-4 py-1 text-xs text-muted-foreground flex items-center gap-1">
                <ArrowRight className="h-3 w-3 rotate-180" /> {t("return")}
            </div>
            <SingleJourney
                segments={returnJourney.segments}
                t={t}
                formatDate={formatDate}
                isReturn
            />
        </div>
    );
}
