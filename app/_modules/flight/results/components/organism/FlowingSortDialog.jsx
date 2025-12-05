"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { SortDesc } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { getDuration, formatDuration } from "../../utils/flightSort";
import SortOptionCard from "../molecule/SortOptionCard";

export default function FlowingSortDialog({ flights, setSortBy, sortBy }) {
    const [open, setOpen] = useState(false);
    const t = useTranslations("Flight");

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
    }, [flights]);

    const applySort = (type) => {
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
                    "open-slide-bottom close-slide-bottom pt-4 shadow"
                )}
            >
                <DialogHeader>
                    <DialogTitle className="flex justify-start text-sm font-bold text-accent-500 ">
                        {t("filters.sort_by")}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    {cheapest && (
                        <SortOptionCard
                            label={t("filters.cheapest")}
                            durationText={formatDuration(
                                getDuration(cheapest),
                                t
                            )}
                            price={cheapest.TotalPrice}
                            active={sortBy === "price"}
                            activeColor="bg-green-500"
                            textColor="text-green-500"
                            onClick={() => applySort("price")}
                        />
                    )}

                    {fastest && (
                        <SortOptionCard
                            label={t("filters.fastest")}
                            durationText={formatDuration(
                                getDuration(fastest),
                                t
                            )}
                            price={fastest.TotalPrice}
                            active={sortBy === "duration"}
                            activeColor="bg-accent-400"
                            textColor="text-accent-500"
                            onClick={() => applySort("duration")}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
