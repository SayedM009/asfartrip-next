import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SunIcon, PlaneIcon, ArrowRightCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function FlightTabs({
    filterBy,
    setFilterBy,
    airlines,
    selectedAirlines,
    setSelectedAirlines,
    tripTimes,
    selectedTripTimes,
    setSelectedTripTimes,
}) {
    const t = useTranslations("Flight");
    function handleValueChange(val) {
        setFilterBy(val);
    }

    function clearSubFiltersFor(tab) {
        if (tab === "airline" && setSelectedAirlines) setSelectedAirlines([]);
        if (tab === "triptime" && setSelectedTripTimes)
            setSelectedTripTimes([]);
    }

    const makePreemptiveHandler = (value) => (e) => {
        if (filterBy === value) {
            e.preventDefault();
            setFilterBy("");
            clearSubFiltersFor(value);
        }
    };

    return (
        <div className="sm:hidden my-3 ">
            <Tabs
                value={filterBy || ""}
                onValueChange={handleValueChange}
                className="w-full  shadow rounded-full "
            >
                <TabsList className="grid grid-cols-3 w-full ">
                    <TabsTrigger
                        value="triptime"
                        onPointerDown={makePreemptiveHandler("triptime")}
                        className="data-[state=active]:bg-accent-100 data-[state=active]:text-accent-500 rounded-full"
                    >
                        <SunIcon className="size-5" />
                        <span className="text-sm">
                            {t("filters.trip_time")}
                        </span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="airline"
                        onPointerDown={makePreemptiveHandler("airline")}
                        className="data-[state=active]:bg-accent-100 data-[state=active]:text-accent-500 rounded-full"
                    >
                        <PlaneIcon className="size-5" />
                        <span className="text-sm">
                            {t("filters.air_lines")}
                        </span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="direct"
                        onPointerDown={makePreemptiveHandler("direct")}
                        className="data-[state=active]:bg-accent-100 data-[state=active]:text-accent-500 rounded-full"
                    >
                        <ArrowRightCircleIcon className="size-5" />
                        <span className="text-sm">{t("filters.direct")}</span>
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Sub Tabs - Airlines */}
            {filterBy === "airline" && (
                <div className="flex gap-4 mt-3 overflow-x-scroll">
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
                            className={`px-3 pt-2 pb-1 rounded-xl border text-sm flex items-center gap-2 flex-col min-w-20 ${
                                selectedAirlines.includes(code) &&
                                "bg-accent-100"
                            }`}
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

            {/* Sub Tabs - Trip Times */}
            {filterBy === "triptime" && (
                <div className="flex gap-2 mt-3 overflow-x-auto">
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
                            className={`px-2 py-1 rounded-xl border text-xs flex flex-col items-center gap-2 ${
                                selectedTripTimes.includes(t.id) &&
                                "bg-accent-100 "
                            }`}
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
