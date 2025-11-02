import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FlightDetailsDialog } from "./FlightDetailsDialog";
import { Plane, Luggage, ArrowRight, Backpack } from "lucide-react";
import { format, parseISO, differenceInMinutes } from "date-fns";
import Image from "next/image";
import { useDateFormatter } from "@/app/_hooks/useDisplayShortDate";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import { useTranslations } from "next-intl";
import { useCurrency } from "@/app/_context/CurrencyContext";
import { useFormatBaggage } from "@/app/_hooks/useFormatBaggage";
import LoyaltyPoints from "../loyaltyPoints/LoyaltyPoints";

export function FlightTicket({ ticket, onSelect, isFastest, isCheapest }) {
    // Convert Currency
    const { formatPrice } = useCurrency();

    const {
        TotalPrice,
        MultiLeg,
        segments,
        onward,
        return: returnJourney,
        CabinLuggage,
        BaggageAllowance,
    } = ticket;
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const { isRTL } = useCheckLocal();
    const formatDate = useDateFormatter();
    const t = useTranslations("Flight");
    const pattern = isRTL ? "EEEE d MMMM " : "EEE, MMM d";

    const { formatBaggage } = useFormatBaggage();
    // Determine if this is a round trip ticket
    const isRoundTrip = MultiLeg === "true" && onward && returnJourney;

    // Get segments for the display (use onward for round trip, segments for one-way)
    const displaySegments = isRoundTrip ? onward.segments : segments;
    const returnSegments = isRoundTrip ? returnJourney.segments : null;

    const firstSegment = displaySegments[0];
    const lastSegment = displaySegments[displaySegments.length - 1];

    // Helper functions
    const formatTime = (isoString) => {
        return format(parseISO(isoString), "HH:mm");
    };

    const calculateTotalDuration = (segmentsArray = displaySegments) => {
        const departure = parseISO(segmentsArray[0].DepartureTime);
        const arrival = parseISO(
            segmentsArray[segmentsArray.length - 1].ArrivalTime
        );
        const totalMinutes = differenceInMinutes(arrival, departure);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes}m`
            .replace("h", t("h"))
            .replace("m", t("m"));
    };

    const calculateLayoverTime = (arrivalTime, nextDepartureTime) => {
        const arrival = parseISO(arrivalTime);
        const departure = parseISO(nextDepartureTime);
        const layoverMinutes = differenceInMinutes(departure, arrival);
        const hours = Math.floor(layoverMinutes / 60);
        const minutes = layoverMinutes % 60;
        return `${hours}h ${minutes}m`;
    };

    const calculateTotalLayoverTime = (segmentsArray = displaySegments) => {
        if (segmentsArray.length <= 1) return "";

        let totalLayoverMinutes = 0;
        for (let i = 0; i < segmentsArray.length - 1; i++) {
            const arrival = parseISO(segmentsArray[i].ArrivalTime);
            const departure = parseISO(segmentsArray[i + 1].DepartureTime);
            totalLayoverMinutes += differenceInMinutes(departure, arrival);
        }

        const hours = Math.floor(totalLayoverMinutes / 60);
        const minutes = totalLayoverMinutes % 60;
        return `${hours}h ${minutes}m`
            .replace("h", t("h"))
            .replace("m", t("m"));
    };

    const getAirlineLogo = (carrier) => {
        return `https://images.kiwi.com/airlines/64x64/${carrier}.png`;
    };

    const isNextDay = (departureTime, arrivalTime) => {
        const departure = parseISO(departureTime);
        const arrival = parseISO(arrivalTime);
        return arrival.getDate() !== departure.getDate();
    };

    const renderSingleJourney = (segments, isReturn = false) => {
        const firstSeg = segments[0];
        const lastSeg = segments[segments.length - 1];

        if (segments.length === 1) {
            // Direct flight
            return (
                <div
                    className={`flex items-center justify-between py-4 px-2 sm:px-4 ${
                        (isCheapest || isFastest) && "pt-6"
                    }`}
                >
                    {/* Departure */}
                    <div className="text-center min-w-0 ">
                        <div className="text-xl font-bold text-foreground">
                            {formatTime(firstSeg.DepartureTime)}
                        </div>
                        <div className="text-muted-foreground text-xs">
                            {firstSeg.Origin}{" "}
                            {formatDate(firstSeg.DepartureTime, {
                                pattern,
                            })}
                        </div>
                    </div>

                    {/* Flight path */}
                    <div className="flex-1 mx-4 relative">
                        <div className="flex items-center justify-center mb-1">
                            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                {calculateTotalDuration(segments)}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="h-0.5 bg-muted-foreground/30 w-full"></div>
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div>
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div>
                        </div>
                        <div className="text-center mt-1">
                            <Badge variant="secondary" className="text-xs">
                                {isReturn
                                    ? t("filters.return")
                                    : t("filters.direct")}
                            </Badge>
                        </div>
                    </div>

                    {/* Arrival */}
                    <div className="text-center min-w-0 ">
                        <div className="text-xl font-bold text-foreground">
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
                            {lastSeg.Destination}{" "}
                            {formatDate(lastSeg.ArrivalTime, {
                                pattern,
                            })}
                        </div>
                    </div>
                </div>
            );
        } else {
            // Connecting flights
            return (
                <div className="py-4 px-2 sm:px-4">
                    {/* Main route overview */}
                    <div className="flex items-center justify-between">
                        {/* Departure */}
                        <div className="text-center">
                            <div className="text-xl font-bold text-foreground">
                                {formatTime(firstSeg.DepartureTime, {
                                    pattern,
                                })}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {firstSeg.Origin}{" "}
                                {formatDate(firstSeg.DepartureTime, {
                                    pattern,
                                })}
                            </div>
                        </div>

                        {/* Journey overview */}
                        <div className="flex-1 mx-4 text-center">
                            <div className="text-xs text-muted-foreground mb-5">
                                {calculateTotalDuration(segments)}
                            </div>
                            <div className="relative">
                                <div className="h-0.5 bg-muted-foreground/30 w-full"></div>
                                {/* Airport codes in boxes over the line */}
                                {segments.slice(0, -1).map((segment, index) => (
                                    <div
                                        key={index}
                                        className="absolute transform -translate-y-1/2 -translate-x-1/2"
                                        style={{
                                            left: `${
                                                ((index + 1) /
                                                    segments.length) *
                                                100
                                            }%`,
                                            top: "50%",
                                        }}
                                    >
                                        <div className="w-2 h-2 bg-muted rounded-full"></div>
                                        <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                            <div className="bg-muted text-foreground text-xs font-medium px-2 py-1 rounded border">
                                                {segment.Destination}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div>
                                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div>
                            </div>
                            <div className="mt-3">
                                <Badge variant="outline" className="text-xs">
                                    {segments.length - 1}{" "}
                                    {segments.length === 2 && t("stop")} •{" "}
                                    {calculateTotalLayoverTime(segments)}
                                </Badge>
                            </div>
                        </div>

                        {/* Arrival */}
                        <div className="text-center">
                            <div className="text-xl font-bold text-foreground">
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
                                {lastSeg.Destination}{" "}
                                {formatDate(lastSeg.ArrivalTime, {
                                    pattern,
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    };

    const renderFlightPath = () => {
        if (isRoundTrip) {
            return (
                <div className="">
                    {/* Outbound Journey */}
                    <div>
                        <div className="px-4 py-1">
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Plane className="h-3 w-3" />
                                Outbound
                            </div>
                        </div>
                        {renderSingleJourney(onward.segments)}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-border/30"></div>

                    {/* Return Journey */}
                    <div>
                        <div className="px-4 py-1">
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <ArrowRight className="h-3 w-3 rotate-180" />
                                Return
                            </div>
                        </div>
                        {renderSingleJourney(returnJourney.segments, true)}
                    </div>
                </div>
            );
        } else {
            return renderSingleJourney(displaySegments);
        }
    };

    const handleCardClick = () => {
        setShowDetailsDialog(true);
    };

    const handleSelectFlight = (e) => {
        e.stopPropagation();
        setShowDetailsDialog(true);
    };

    const handleContinueToBooking = () => {
        setShowDetailsDialog(false);
        onSelect?.();
    };

    return (
        <>
            <Card
                // className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary cursor-pointer sm:cursor-default"
                className={`hover:shadow-lg transition-all duration-300  sm:cursor-default pt-3 pb-0  dark:shadow-gray-600 
    ${
        isCheapest
            ? "border-3 border-green-500"
            : isFastest
            ? "border-3 border-accent-400"
            : "border border-transparent"
    }
    relative
  `}
                onClick={handleCardClick}
            >
                <CardContent className="p-0 cursor-pointer">
                    {isCheapest && (
                        <div
                            className={`absolute ${
                                isRTL ? "left-[-2px]" : "right-[-2px]"
                            } top-[-2px] z-10 `}
                        >
                            <span
                                className={`bg-green-500 text-white text-[10px] font-semibold p-2  uppercase ${
                                    isRTL ? "rounded-tl-lg" : "rounded-tr-lg"
                                }`}
                            >
                                {t("filters.cheapest")}
                            </span>
                        </div>
                    )}

                    {isFastest && (
                        <div
                            className={`absolute ${
                                isCheapest
                                    ? `left-[-2px]  top-[-2px]`
                                    : `${
                                          isRTL ? "left-[-2px]" : "right-[-2px]"
                                      } top-[-2px]`
                            }
                            } z-10`}
                        >
                            <span
                                className={`bg-accent-400 text-white text-[10px] font-semibold p-2  uppercase ${
                                    isFastest && isCheapest
                                        ? "rounded-tl-lg"
                                        : `${
                                              isRTL
                                                  ? "rounded-tl-lg"
                                                  : "rounded-tr-lg"
                                          }`
                                }`}
                            >
                                {t("filters.fastest")}
                            </span>
                        </div>
                    )}

                    {/* Main flight path */}
                    {renderFlightPath()}

                    {/* Divider */}
                    <div className="border-t border-border/50"></div>

                    {/* Footer with price and details */}
                    <div className="py-2 px-4">
                        <div className="flex items-center justify-between">
                            {/* Left side - Airline and flight details */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={`/airline_logo/${firstSegment.Carrier}.png`}
                                        alt={firstSegment.Carrier}
                                        className="w-8 h-8 rounded"
                                        width={30}
                                        height={30}
                                        loading="lazy"
                                        onError={(e) => {
                                            e.currentTarget.src = `https://images.kiwi.com/airlines/64x64/${firstSegment.Carrier}.png`;
                                        }}
                                    />
                                    <div>
                                        <div className="font-medium text-sm">
                                            {t(
                                                `airlines.${firstSegment.Carrier}`
                                            ) || firstSegment.Carrier}
                                        </div>
                                        <div className="text-xs text-muted-foreground capitalize flex items-center gap-2">
                                            {t(
                                                `ticket_class.${String(
                                                    firstSegment.CabinClass
                                                ).toLowerCase()}`
                                            )}
                                            {CabinLuggage && (
                                                <Backpack className="size-4" />
                                            )}
                                            {formatBaggage(
                                                BaggageAllowance[0]
                                            ).toLocaleLowerCase() !=
                                                "not included" && (
                                                <Luggage className="size-4" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end sm:items-center gap-0.5">
                                {/* Earned Points */}
                                <LoyaltyPoints price={TotalPrice} />
                                <div className="text-xs text-muted-foreground">
                                    {t("total_price")}
                                </div>

                                <div className=" font-bold  text-accent-500">
                                    <span className="text-2xl">
                                        {formatPrice(TotalPrice)}
                                    </span>
                                </div>

                                {/* Desktop Select Button - under price */}
                                <div className="hidden sm:block  ">
                                    <Button
                                        onClick={handleSelectFlight}
                                        size="lg"
                                        className=" btn-primary"
                                    >
                                        {t("select_flight")}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <FlightDetailsDialog
                ticket={ticket}
                isOpen={showDetailsDialog}
                onClose={() => setShowDetailsDialog(false)}
                onContinue={handleContinueToBooking}
            />
        </>
    );
}
