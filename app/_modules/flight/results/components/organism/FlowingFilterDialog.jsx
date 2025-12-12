"use client";

import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Funnel } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useState } from "react";
import FlightFilters from "./FlightFilters";

export default function FlowingFilterDialog({
    flights,
    selectedFilters,
    setSelectedFilters,
}) {
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
                    "max-w-none w-full h-full rounded-none border-0 shadow overflow-y-auto",
                    "open-slide-bottom close-slide-bottom pt-4"
                )}
            >
                <DialogHeader>
                    <DialogTitle className="text-sm font-bold text-accent-500 ">
                        {t("filters.filter")}
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
