"use client";
import { useDateFormatter } from "@/app/_hooks/useDisplayShortDate";
import { PencilLineIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { parseDate } from "../../utils/parseDate";
import { useTranslations } from "next-intl";

function SearchSummary() {
    const searchParams = useSearchParams();
    const country = searchParams.get("country");
    const tripType = searchParams.get("tripType");
    const { from, to } = JSON.parse(searchParams.get("dates"));
    const passengers = JSON.parse(searchParams.get("passengers"));
    const totalPassengers = Object.values(passengers).reduce((a, b) => a + b);
    const formatDate = useDateFormatter();
    const pattern = true ? " d MMMM" : "d MMM";
    const r = useTranslations("Insurance.results");
    const s = useTranslations("Insurance.search");
    return (
        <div>
            <h2 className="text-sm">{r(country) || "United Arab Emirates"}</h2>
            <div
                className="flex items-center gap-2 justify-center text-xs text-accent-500
            "
            >
                <span>
                    {formatDate(parseDate(from), { pattern })}{" "}
                    {to ? "-" + formatDate(parseDate(to), { pattern }) : ""}
                </span>
                <span>|</span>
                <span className="capitalize">
                    {totalPassengers}{" "}
                    {totalPassengers === 1 ? r("passenger") : r("passengers")}
                </span>
                <span>|</span>
                <span className="capitalize">{s(tripType)}</span>
                <PencilLineIcon className="size-3" />
            </div>
        </div>
    );
}

export default SearchSummary;
