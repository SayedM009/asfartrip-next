import { Funnel, SortDesc } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { cn } from "../ui/utils";
import FlightFilters from "./FlightFilters";
import React, { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useCurrency } from "@/app/_context/CurrencyContext";
export default function FloatingSortFilter({
    flights,
    setSortBy,
    sortBy,
    originalFlights,
    selectedFilters,
    setSelectedFilters,
}) {
    return (
        <section
            className="md:hidden 
        fixed bottom-3 left-50 translate-x-[-50%] sm:left-90 bg-accent-50 shadow text-accent-500 px-3 py-2 rounded-xl font-semibold flex items-center space-x-2 whitespace-nowrap"
        >
            <FlowingSortDialog
                flights={flights}
                setSortBy={setSortBy}
                sortBy={sortBy}
            />
            <span>|</span>
            <FlowingFilterDialog
                flights={originalFlights}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
            />
        </section>
    );
}

function FlowingSortDialog({ flights, setSortBy, sortBy }) {
    const t = useTranslations("Flight");
    const [open, setOpen] = useState(false);
    const { formatPrice } = useCurrency();

    function getAllSegments(flight) {
        if (!flight) return [];

        if (flight.MultiLeg === "true" && Array.isArray(flight.legs)) {
            return flight.legs.flatMap((leg) => leg.segments || []);
        }

        const onward = flight?.onward?.segments || flight?.segments || [];
        const ret = flight?.return?.segments || [];
        return [...onward, ...ret];
    }

    const getDuration = useCallback((flight) => {
        const segs = getAllSegments(flight);
        if (!segs || segs.length === 0) return 0;

        const first = segs[0];
        const last = segs[segs.length - 1];
        if (!first?.DepartureTime || !last?.ArrivalTime) return 0;

        const dep = new Date(first.DepartureTime).getTime();
        const arr = new Date(last.ArrivalTime).getTime();
        return arr - dep;
    }, []);

    function formatDuration(ms) {
        if (!ms || ms <= 0) return "0h 0m";
        const minutes = Math.floor(ms / 60000);
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`.replace("h", t("h")).replace("m", t("m"));
    }

    const cheapest = useMemo(() => {
        if (!flights || flights.length === 0) return null;
        return flights.reduce((min, f) =>
            f.TotalPrice < min.TotalPrice ? f : min
        );
    }, [flights]);

    const fastest = useMemo(() => {
        if (!flights || flights.length === 0) return null;
        return flights.reduce((min, f) =>
            getDuration(f) < getDuration(min) ? f : min
        );
    }, [flights, getDuration]);

    const handleSort = (type) => {
        setSortBy(type);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="flex-1" asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                    <SortDesc className="size-5" />
                    <span>{t("filters.sort")}</span>
                </div>
            </DialogTrigger>

            <DialogContent
                className={cn(
                    "max-w-none w-full h-[28vh] top-200 rounded-t-xl border-0 md:h-11/12 md:rounded",
                    "open-slide-bottom close-slide-bottom",
                    "pt-4 shadow"
                )}
            >
                <DialogHeader>
                    <DialogTitle className="flex justify-start">
                        <h2 className="text-sm font-semibold text-accent-500">
                            {t("filters.sort_by")}
                        </h2>
                    </DialogTitle>

                    <DialogDescription className="space-y-4 mt-4">
                        {cheapest && (
                            <button
                                onClick={() => handleSort("price")}
                                className={`w-full flex justify-between items-center px-4 py-3 border rounded-xl uppercase
                                    ${
                                        sortBy === "price"
                                            ? "bg-green-500 text-white"
                                            : "bg-transparent text-green-500"
                                    }`}
                            >
                                <div className="text-left">
                                    <p className="font-semibold">
                                        {t("filters.cheapest")}
                                    </p>
                                    <p className="text-xs ">
                                        {formatDuration(getDuration(cheapest))}
                                    </p>
                                </div>
                                <div className="font-bold">
                                    {formatPrice(cheapest.TotalPrice)}
                                </div>
                            </button>
                        )}

                        {fastest && (
                            <button
                                onClick={() => handleSort("duration")}
                                className={`w-full flex justify-between items-center px-4 py-3 border rounded-xl uppercase
                                    ${
                                        sortBy === "duration"
                                            ? "bg-accent-400 text-white"
                                            : "bg-transparent text-accent-500"
                                    }`}
                            >
                                <div className="">
                                    <p className="font-semibold">
                                        {t("filters.fastest")}
                                    </p>
                                    <p className="text-xs ">
                                        {formatDuration(getDuration(fastest))}
                                    </p>
                                </div>
                                <div className="font-bold">
                                    {formatPrice(fastest.TotalPrice)}
                                </div>
                            </button>
                        )}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

function FlowingFilterDialog({ flights, selectedFilters, setSelectedFilters }) {
    const [open, setOpen] = useState(false);
    const t = useTranslations("Flight");
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                    <Funnel className="size-4" />
                    <span>{t("filters.filter")}</span>
                </div>
            </DialogTrigger>

            <DialogContent
                className={cn(
                    "max-w-none w-full h-[80vh] top-140 rounded-t-xl border-0 md:h-11/12 md:rounded",
                    "open-slide-bottom close-slide-bottom",
                    "pt-4 shadow overflow-y-auto"
                )}
            >
                <DialogHeader>
                    <DialogTitle className="flex justify-start">
                        <h2 className="text-sm font-semibold text-accent-500">
                            {t("filters.filter")}
                        </h2>
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4">
                    <FlightFilters
                        flights={flights}
                        selectedFilters={selectedFilters}
                        setSelectedFilters={setSelectedFilters}
                        setOpen={setOpen}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
