"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import { useSearchParams } from "next/navigation";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import { useAirportTranslation } from "@/app/_hooks/useAirportTranslation";

export default function DisplayedCities() {
    const { isRTL } = useCheckLocal();
    const params = useSearchParams();
    const { getCityName } = useAirportTranslation();

    const citiesParam = params.get("cities");
    const searchObjectParam = params.get("searchObject");

    if (!citiesParam || !searchObjectParam) return null;

    const { departure: departureObj, destination: destinationObj } =
        JSON.parse(citiesParam);
    const { type } = JSON.parse(searchObjectParam);


    
        
        // Get translated city names from airport codes
        const translatedDepartureCity = getCityName(JSON.parse(searchObjectParam).origin) || departureObj.city;
        const translatedDestinationCity = getCityName(JSON.parse(searchObjectParam).destination) || destinationObj.city;

    return (
        <div>
            <h1 className="text-lg font-semibold capitalize flex items-center gap-2">
                <span className="max-ch-10">{translatedDepartureCity || departureObj.city}</span>

                {type === "O" ? (
                    isRTL ? (
                        <ArrowLeft className="size-5" />
                    ) : (
                        <ArrowRight className="size-5" />
                    )
                ) : (
                    <ArrowsRightLeftIcon className="size-5" />
                )}

                <span className="max-ch-10">{translatedDestinationCity || destinationObj.city}</span>
            </h1>
        </div>
    );
}
