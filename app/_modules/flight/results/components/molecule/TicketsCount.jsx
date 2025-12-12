"use client";

import { useTranslations } from "next-intl";
import DisplayedCities from "./DisplayedCities";

export default function TicketsCount({ filteredAndSortedFlights }) {
    const t = useTranslations("Flight");

    return (
        <div className="flex items-center justify-between gap-2 px-2 my-0">
            <DisplayedCities />
            <p className="text-xs capitalize flex items-center gap-1 text-accent-500">
                {filteredAndSortedFlights
                    ? String(filteredAndSortedFlights.length).padStart(2, "0")
                    : "00"}
                <span>{t("filters.flights")}</span>
            </p>
        </div>
    );
}
