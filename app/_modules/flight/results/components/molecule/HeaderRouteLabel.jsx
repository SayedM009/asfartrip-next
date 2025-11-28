"use client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import { useAirportTranslation } from "@/app/_hooks/useAirportTranslation";

export default function HeaderRouteLabel({ origin, destination, type, isRTL }) {
    const t = useTranslations("Flight");
    const { getCityName } = useAirportTranslation();
    return (
        <div className="flex items-center gap-2">
            <div className="flex gap-1 items-center">
                {/* <span className="text-md font-semibold">{origin}</span> */}
                <span className="text-sm ">
                    {getCityName(origin) || origin}
                </span>
            </div>

            {type === "O" ? (
                isRTL ? (
                    <ArrowLeft className="size-4" />
                ) : (
                    <ArrowRight className="size-4" />
                )
            ) : (
                <ArrowsRightLeftIcon className="size-4" />
            )}

            <div className="flex gap-1 items-center">
                {/* <span className="text-md font-semibold">{destination}</span> */}
                <span className="text-sm">
                    {getCityName(destination) || destination}
                </span>
            </div>
        </div>
    );
}
