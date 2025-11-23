"use client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";

export default function HeaderRouteLabel({ origin, destination, type, isRTL }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{origin}</span>

            {type === "O" ? (
                isRTL ? (
                    <ArrowLeft className="size-4" />
                ) : (
                    <ArrowRight className="size-4" />
                )
            ) : (
                <ArrowsRightLeftIcon className="size-4" />
            )}

            <span className="text-sm font-semibold">{destination}</span>
        </div>
    );
}
