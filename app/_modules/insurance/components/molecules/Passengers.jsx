"use client";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Users, Plus, Minus, Info } from "lucide-react";
import { incrementPassenger } from "../../utils/incrementPassenger";
import { decrementPassenger } from "../../utils/decrementPassenger";

export default function Passengers({ t, PD, passengers, setPassengers }) {
    const getSummary = () => {
        const parts = [];
        if (passengers.adults > 0)
            parts.push(`${passengers.adults} ${t("adults")}`);
        if (passengers.children > 0)
            parts.push(`${passengers.children} ${t("children")}`);
        if (passengers.seniors > 0)
            parts.push(`${passengers.seniors} ${t("seniors")}`);
        return parts.join(", ") || t("select_passengers");
    };

    return (
        <div className="w-full">
            <label className="block mb-2 text-muted-foreground text-xs">
                {t("passengers")}
            </label>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full h-auto  justify-start text-start  bg-input-background"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-stone-50 rounded-lg text-slate-500">
                                <Users className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col items-start">
                                <span className=" text-sm">{getSummary()}</span>
                            </div>
                        </div>
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-2"
                    align="start"
                >
                    <div className="flex flex-col gap-1">
                        {Object.entries(PD).map(([key, data]) => {
                            const currentVal = passengers[key];

                            return (
                                <div
                                    key={key}
                                    className="flex items-center justify-between p-3 rounded-lg"
                                >
                                    {/* الجزء الأيمن: النصوص */}
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm ">
                                            {t(key)}
                                        </span>
                                        <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                                            <Info className="w-3 h-3" />
                                            <span className="text-[10px]">
                                                {t("age")} {data.ageRange[0]} -{" "}
                                                {data.ageRange[1]}
                                            </span>
                                        </div>
                                    </div>

                                    {/* الجزء الأيسر: العداد */}
                                    <div className="flex items-center gap-3">
                                        {/* زر النقصان */}
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 rounded-full border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                                            disabled={currentVal <= 0}
                                            onClick={() =>
                                                decrementPassenger(
                                                    key,
                                                    setPassengers
                                                )
                                            }
                                        >
                                            <Minus className="w-4 h-4" />
                                        </Button>

                                        {/* الرقم */}
                                        <span className="w-4 text-center font-bold text-sm">
                                            {currentVal}
                                        </span>

                                        {/* زر الزيادة - ملون */}
                                        <Button
                                            size="icon"
                                            className="h-8 w-8 rounded-full   shadow-sm cursor-pointer"
                                            onClick={() =>
                                                incrementPassenger(
                                                    key,
                                                    setPassengers
                                                )
                                            }
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
