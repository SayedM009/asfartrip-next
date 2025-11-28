"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SunIcon, PlaneIcon, ArrowRightCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import clsx from "clsx";

export default function FlightTabs({
    filterBy,
    setFilterBy,
    airlines = [],
    selectedAirlines = [],
    setSelectedAirlines,
    tripTimes = [],
    selectedTripTimes = [],
    setSelectedTripTimes,
}) {
    const t = useTranslations("Flight");

    // -----------------------------
    // Handler: Switch Main Tab
    // -----------------------------
    function handleValueChange(val) {
        setFilterBy(val);
    }

    // -----------------------------
    // Clear Filters if tab is closed
    // -----------------------------
    function clearSubFiltersFor(tab) {
        if (tab === "airline" && setSelectedAirlines) {
            setSelectedAirlines([]);
        }
        if (tab === "triptime" && setSelectedTripTimes) {
            setSelectedTripTimes([]);
        }
    }

    // -----------------------------
    // UX: Click Again → Close Tab
    // -----------------------------
    const makePreemptiveHandler = (value) => (e) => {
        if (filterBy === value) {
            e.preventDefault();
            setFilterBy("");
            clearSubFiltersFor(value);
        }
    };

    return (
        <div className="sm:hidden my-3">
            {/* Main Tabs */}
            <Tabs
                value={filterBy || ""}
                onValueChange={handleValueChange}
                className="w-full shadow rounded-full"
            >
                <TabsList className="grid grid-cols-3 w-full bg-background border p-0">
                    {/* Trip Time Tab */}
                    <TabsTrigger
                        value="triptime"
                        onPointerDown={makePreemptiveHandler("triptime")}
                        className="data-[state=active]:bg-accent-100 data-[state=active]:text-accent-500 rounded-lg "
                    >
                        <SunIcon className="size-5" />
                        <span className="text-sm">
                            {t("filters.trip_time")}
                        </span>
                    </TabsTrigger>

                    {/* Airlines Tab */}
                    <TabsTrigger
                        value="airline"
                        onPointerDown={makePreemptiveHandler("airline")}
                        className="data-[state=active]:bg-accent-100 data-[state=active]:text-accent-500 rounded-lg"
                    >
                        <PlaneIcon className="size-5" />
                        <span className="text-sm">
                            {t("filters.air_lines")}
                        </span>
                    </TabsTrigger>

                    {/* Direct Flights */}
                    <TabsTrigger
                        value="direct"
                        onPointerDown={makePreemptiveHandler("direct")}
                        className="data-[state=active]:bg-accent-100 data-[state=active]:text-accent-500 rounded-lg"
                    >
                        <ArrowRightCircleIcon className="size-5" />
                        <span className="text-sm">{t("filters.direct")}</span>
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* -------------------------------
               Airline Sub-Tabs
            -------------------------------- */}
            {filterBy === "airline" && (
                <div className="flex gap-4 mt-3 overflow-x-scroll no-scrollbar ">
                    {airlines.map((code) => (
                        <button
                            key={code}
                            onClick={() =>
                                setSelectedAirlines((prev) =>
                                    prev.includes(code)
                                        ? prev.filter((a) => a !== code)
                                        : [...prev, code]
                                )
                            }
                            className={clsx(
                                "px-3 pt-2 pb-1 rounded-xl border text-sm flex items-center gap-2 flex-col min-w-20",
                                selectedAirlines.includes(code) &&
                                    "bg-accent-500 text-white"
                            )}
                        >
                            <Image
                                src={`https://images.kiwi.com/airlines/64x64/${code}.png`}
                                alt={code}
                                className="w-5 h-5"
                                width={30}
                                height={30}
                            />
                            
                            <span className="text-xs">{code}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* -------------------------------
               Trip Time Sub-Tabs
            -------------------------------- */}
            {filterBy === "triptime" && (
                <div className="flex justify-between gap-2 mt-3 overflow-x-auto no-scrollbar">
                    {tripTimes.map((t) => (
                        <button
                            key={t.id}
                            onClick={() =>
                                setSelectedTripTimes((prev) =>
                                    prev.includes(t.id)
                                        ? prev.filter((x) => x !== t.id)
                                        : [...prev, t.id]
                                )
                            }
                            className={clsx(
                                "px-2 py-1 rounded-xl border text-xs flex flex-col items-center gap-2",
                                selectedTripTimes.includes(t.id) &&
                                    "bg-accent-500 text-white"
                            )}
                        >
                            <span>{t.icon}</span>
                            <span className="text-[12px] whitespace-nowrap font-semibold">
                                {t.label}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
