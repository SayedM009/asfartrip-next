import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FlightDetailsDialog } from "./FlightDetailsDialog";
import { Plane, Clock, Luggage, ArrowRight } from "lucide-react";
import { format, parseISO, differenceInMinutes } from "date-fns";
import Image from "next/image";

// Airline code to name mapping
const getAirlineName = (code) => {
    const airlines = {
        EK: "Emirates",
        FZ: "flydubai",
        J2: "Azerbaijan Airlines",
        TK: "Turkish Airlines",
        AF: "Air France",
        BA: "British Airways",
        LH: "Lufthansa",
        KL: "KLM",
        QR: "Qatar Airways",
        EY: "Etihad Airways",
        SV: "Saudia",
        MS: "EgyptAir",
        RJ: "Royal Jordanian",
        ME: "Middle East Airlines",
        HR: "Hahn Air",
    };
    return airlines[code] || code;
};

export function FlightTicket({ ticket, onSelect, isFastest, isCheapest }) {
    const {
        TotalPrice,
        SITECurrencyType,
        MultiLeg,
        segments,
        onward,
        return: returnJourney,
        CabinLuggage,
    } = ticket;
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);

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

    const formatDate = (isoString) => {
        return format(parseISO(isoString), "EEE, MMM d");
    };

    const calculateTotalDuration = (segmentsArray = displaySegments) => {
        const departure = parseISO(segmentsArray[0].DepartureTime);
        const arrival = parseISO(
            segmentsArray[segmentsArray.length - 1].ArrivalTime
        );
        const totalMinutes = differenceInMinutes(arrival, departure);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes}m`;
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
        return `${hours}h ${minutes}m`;
    };

    const getAirlineLogo = (carrier) => {
        // In a real app, you'd have a mapping of carrier codes to logo URLs
        // For now, we'll use a placeholder approach
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
                    className={`flex items-center justify-between p-4 ${
                        (isCheapest || isFastest) && "pt-6"
                    }`}
                >
                    {/* Departure */}
                    <div className="text-center min-w-0 flex-1">
                        <div className="text-xl font-bold text-foreground">
                            {formatTime(firstSeg.DepartureTime)}
                        </div>
                        <div className="text-muted-foreground text-xs">
                            {firstSeg.Origin}{" "}
                            {formatDate(firstSeg.DepartureTime)}
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
                            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <Plane className="h-4 w-4 text-primary" />
                            </div>
                        </div>
                        <div className="text-center mt-1">
                            <Badge variant="secondary" className="text-xs">
                                {isReturn ? "Return" : "Direct"}
                            </Badge>
                        </div>
                    </div>

                    {/* Arrival */}
                    <div className="text-center min-w-0 flex-1">
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
                            {formatDate(lastSeg.ArrivalTime)}
                        </div>
                    </div>
                </div>
            );
        } else {
            // Connecting flights
            return (
                <div className="p-4">
                    {/* Main route overview */}
                    <div className="flex items-center justify-between">
                        {/* Departure */}
                        <div className="text-center">
                            <div className="text-xl font-bold text-foreground">
                                {formatTime(firstSeg.DepartureTime)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {firstSeg.Origin}{" "}
                                {formatDate(firstSeg.DepartureTime)}
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
                                    {segments.length === 2 ? "Stop" : "Stops"} •{" "}
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
                                {formatDate(lastSeg.ArrivalTime)}
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
                        <div className="absolute right-[-2px] top-[-2px] z-10 ">
                            <span className="bg-green-500 text-white text-[10px] font-semibold py-2 px-1 uppercase rounded-tr-lg">
                                Cheapest
                            </span>
                        </div>
                    )}

                    {isFastest && (
                        <div
                            className={`absolute ${
                                isCheapest
                                    ? "left-[-2px]  top-[-2px]"
                                    : "right-[-2px] top-[-2px]"
                            } z-10`}
                        >
                            <span
                                className={`bg-accent-400 text-white text-[10px] font-semibold py-2 px-1 uppercase ${
                                    isFastest && isCheapest
                                        ? "rounded-tl-lg"
                                        : " rounded-tr-lg"
                                }`}
                            >
                                Fastest
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
                                        src={getAirlineLogo(
                                            firstSegment.Carrier
                                        )}
                                        alt={firstSegment.Carrier}
                                        className="w-8 h-8 rounded"
                                        onError={(e) => {
                                            e.src =
                                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iIzk0YTNiOCIvPgo8L3N2Zz4K";
                                        }}
                                        width={30}
                                        height={30}
                                    />
                                    <div>
                                        <div className="font-medium text-sm">
                                            {getAirlineName(
                                                firstSegment.Carrier
                                            )}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {firstSegment.CabinClass}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right side - Price and select button */}
                            <div className="text-right">
                                <div className="flex items-center gap-3">
                                    <div>
                                        <div className="text-xs text-muted-foreground">
                                            Total Price
                                        </div>
                                        <div className="text-2xl font-bold  text-accent-500 sm:text-gray-950">
                                            {SITECurrencyType} {TotalPrice}
                                        </div>

                                        {/* Desktop Select Button - under price */}
                                        <div className="hidden sm:block mt-2 ">
                                            <Button
                                                onClick={handleSelectFlight}
                                                size="lg"
                                                className=" btn-primary"
                                            >
                                                Select Flight
                                            </Button>
                                        </div>
                                    </div>
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
