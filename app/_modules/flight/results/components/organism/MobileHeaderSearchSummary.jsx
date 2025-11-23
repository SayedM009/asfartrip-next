"use client";

import { PencilLineIcon } from "lucide-react";
import HeaderCabinLabel from "../molecule/HeaderCabinLabel";
import HeaderPassengersLabel from "../molecule/HeaderPassengersLabel";
import HeaderDateLabel from "../molecule/HeaderDateLabel";
import HeaderRouteLabel from "../molecule/HeaderRouteLabel";

export default function MobileHeaderSearchSummary({
    origin,
    destination,
    type,
    isRTL,
    departDate,
    returnDate,
    formatDate,
    pattern,
    totalPassengers,
    tripClass,
}) {
    return (
        <div className="flex flex-col items-center">
            <HeaderRouteLabel
                origin={origin}
                destination={destination}
                type={type}
                isRTL={isRTL}
            />

            <div className="flex items-center gap-1 text-accent-500">
                <HeaderDateLabel
                    departDate={departDate}
                    returnDate={returnDate}
                    formatDate={formatDate}
                    pattern={pattern}
                />

                <span>|</span>

                <HeaderPassengersLabel totalPassengers={totalPassengers} />

                <span>|</span>

                <HeaderCabinLabel tripClass={tripClass} />

                <PencilLineIcon className="size-3" />
            </div>
        </div>
    );
}
