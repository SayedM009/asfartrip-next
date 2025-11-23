"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import { useSearchParams } from "next/navigation";
import useCheckLocal from "@/app/_hooks/useCheckLocal";

export default function DisplayedCities() {
    const { isRTL } = useCheckLocal();
    const params = useSearchParams();

    const citiesParam = params.get("cities");
    const searchObjectParam = params.get("searchObject");

    if (!citiesParam || !searchObjectParam) return null;

    const { departure: departureObj, destination: destinationObj } =
        JSON.parse(citiesParam);
    const { type } = JSON.parse(searchObjectParam);

    return (
        <div>
            <h1 className="text-lg font-semibold capitalize flex items-center gap-2">
                <span className="max-ch-10">{departureObj.city}</span>

                {type === "O" ? (
                    isRTL ? (
                        <ArrowLeft className="size-5" />
                    ) : (
                        <ArrowRight className="size-5" />
                    )
                ) : (
                    <ArrowsRightLeftIcon className="size-5" />
                )}

                <span className="max-ch-10">{destinationObj.city}</span>
            </h1>
        </div>
    );
}
