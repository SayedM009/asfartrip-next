"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatTime, formatSegmentDuration } from "../../utils/flightTimeUtils";
import { useTranslations } from "next-intl";
import { useDateFormatter } from "@/app/_hooks/useDisplayShortDate";

export default function SegmentCard({ segment }) {
    const t = useTranslations("Flight");
    const formatDate = useDateFormatter();

    return (
        <div className="border rounded-lg px-2 py-4 sm:p-4">
            <div className="flex gap-4">
                {/* LEFT — TIME INFO */}
                <div className="flex flex-col justify-between">
                    {/* Departure */}
                    <div>
                        <div className="font-semibold text-lg">
                            {formatTime(segment.DepartureTime)}
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                            {formatDate(segment.DepartureTime, {
                                pattern: " d MMMM ",
                            })}
                        </div>
                    </div>

                    {/* Duration Badge */}
                    <div className="text-sm text-muted-foreground mb-1">
                        <Badge variant="secondary" className="w-full p-2">
                            {formatSegmentDuration(segment.Duration, t)}
                        </Badge>
                    </div>

                    {/* Arrival */}
                    <div>
                        <div className="font-semibold text-lg">
                            {formatTime(segment.ArrivalTime)}
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                            {formatDate(segment.ArrivalTime, {
                                pattern: " d MMMM ",
                            })}
                        </div>
                    </div>
                </div>

                {/* MIDDLE — TIMELINE */}
                <div className="text-center flex flex-col justify-center">
                    <div className="relative">
                        <div className="h-50 bg-muted-foreground/30 w-0.5"></div>
                        <div className="absolute left-0 top-0 transform -translate-x-0.5 w-2 h-2 bg-primary rounded-full"></div>
                        <div className="absolute left-0 bottom-0 transform -translate-x-0.5 w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                </div>

                {/* RIGHT — AIRPORT & AIRLINE */}
                <div className="flex flex-col justify-between relative">
                    {/* Origin */}
                    <div>
                        <div className="font-medium flex items-center gap-2">
                            {segment.Origin}
                            {segment.OriginTerminal && (
                                <span className="text-sm text-muted-foreground">
                                    {t("dialog.terminal")}{" "}
                                    {segment.OriginTerminal}
                                </span>
                            )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {segment.OriginAirport}
                        </div>
                    </div>

                    {/* Airline */}
                    <div className="flex items-center gap-3 mb-4">
                        <Image
                            src={`/airline_logo/${segment.Carrier}.png`}
                            alt={segment.Carrier}
                            className="w-8 h-8 sm:w-12 sm:h-12 rounded"
                            onError={(e) => {
                                e.currentTarget.src = `https://images.kiwi.com/airlines/64x64/${segment.Carrier}.png`;
                            }}
                            loading="lazy"
                            width={50}
                            height={50}
                        />
                        <div>
                            <div className="font-medium">
                                {t(`airlines.${segment.Carrier}`) ||
                                    segment.Carrier}{" "}
                                {segment.FlightNumber}
                            </div>
                            <div className="text-sm text-muted-foreground capitalize">
                                {segment.Equipment} •{" "}
                                {t(
                                    `ticket_class.${String(
                                        segment.CabinClass
                                    ).toLowerCase()}`
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Destination */}
                    <div>
                        <div className="font-medium flex items-center gap-2">
                            {segment.Destination}
                            {segment.DestinationTerminal && (
                                <span className="text-sm text-muted-foreground">
                                    {t("dialog.terminal")}{" "}
                                    {segment.DestinationTerminal}
                                </span>
                            )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {segment.DestinationAirport}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
