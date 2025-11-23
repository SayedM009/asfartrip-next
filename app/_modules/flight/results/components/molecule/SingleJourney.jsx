"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { formatTime, calculateTotalDuration } from "../../utils/flightTime";
import { calculateTotalLayover } from "../../utils/flightLayover";
import { isNextDay } from "../../utils/flightHelpers";
import { useTranslations } from "next-intl";

export default function SingleJourney({ segments, t, formatDate, isReturn }) {
    const firstSeg = segments[0];
    const lastSeg = segments[segments.length - 1];

    const isDirect = segments.length === 1;

    if (isDirect) {
        return (
            <div className="flex items-center justify-between py-4 px-2 sm:px-4">
                <div className="text-center min-w-0">
                    <div className="text-xl font-bold">
                        {formatTime(firstSeg.DepartureTime)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        <span className="font-bold">{firstSeg.Origin}</span>{" "}
                        {formatDate(firstSeg.DepartureTime)}
                    </div>
                </div>

                <div className="flex-1 mx-4 relative text-center">
                    <div className="text-xs mb-1 bg-muted px-2 py-1 rounded-full inline-block">
                        {calculateTotalDuration(segments, t)}
                    </div>
                    <div className="relative">
                        <div className="h-0.5 bg-muted-foreground/30 w-full" />
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
                    </div>

                    <Badge variant="secondary" className="text-xs mt-1">
                        {isReturn ? t("filters.return") : t("filters.direct")}
                    </Badge>
                </div>

                <div className="text-center min-w-0">
                    <div className="text-xl font-bold flex justify-center">
                        {formatTime(lastSeg.ArrivalTime)}
                        {isNextDay(
                            firstSeg.DepartureTime,
                            lastSeg.ArrivalTime
                        ) && (
                            <sup className="text-xs text-destructive ml-1">
                                +1
                            </sup>
                        )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        <span className="font-bold">{lastSeg.Destination}</span>{" "}
                        {formatDate(lastSeg.ArrivalTime)}
                    </div>
                </div>
            </div>
        );
    }

    // Connecting flight
    return (
        <div className="py-4 px-2 sm:px-4">
            {/* Departure + Arrival + Line */}
            <div className="flex items-center justify-between">
                <div className="text-center">
                    <div className="text-xl font-bold">
                        {formatTime(firstSeg.DepartureTime)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        <span className="font-bold">{firstSeg.Origin}</span>{" "}
                        {formatDate(firstSeg.DepartureTime)}
                    </div>
                </div>

                <div className="flex-1 mx-4 text-center">
                    <div className="text-xs text-muted-foreground mb-5">
                        {calculateTotalDuration(segments, t)}
                    </div>

                    <div className="relative">
                        <div className="h-0.5 bg-muted-foreground/30 w-full"></div>
                        {segments.slice(0, -1).map((seg, index) => (
                            <div
                                key={index}
                                className="absolute -translate-y-1/2 -translate-x-1/2"
                                style={{
                                    left: `${
                                        ((index + 1) / segments.length) * 100
                                    }%`,
                                    top: "50%",
                                }}
                            >
                                <div className="w-2 h-2 bg-muted rounded-full" />
                                <div className="absolute top-[-10px] left-1/2 -translate-x-1/2">
                                    <div className="bg-muted text-xs px-2 py-1 rounded border">
                                        {seg.Destination}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-3">
                        <Badge variant="outline" className="text-xs">
                            {segments.length - 1} {t("stop")} •{" "}
                            {calculateTotalLayover(segments, t)}
                        </Badge>
                    </div>
                </div>

                <div className="text-center">
                    <div className="text-xl font-bold flex justify-center">
                        {formatTime(lastSeg.ArrivalTime)}
                        {isNextDay(
                            firstSeg.DepartureTime,
                            lastSeg.ArrivalTime
                        ) && (
                            <sup className="text-xs text-destructive ml-1">
                                +1
                            </sup>
                        )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        <span className="font-bold">{lastSeg.Destination}</span>{" "}
                        {formatDate(lastSeg.ArrivalTime)}
                    </div>
                </div>
            </div>
        </div>
    );
}
