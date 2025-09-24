import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FlightDetailsDialog } from "./FlightDetailsDialog";
import { Plane, Clock, Luggage } from "lucide-react";
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

export function FlightTicket({ ticket, onSelect }) {
    const { TotalPrice, SITECurrencyType, segments, CabinLuggage } = ticket;
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);

    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];

    // Helper functions
    const formatTime = (isoString) => {
        return format(parseISO(isoString), "HH:mm");
    };

    const formatDate = (isoString) => {
        return format(parseISO(isoString), "EEE, MMM d");
    };

    const calculateTotalDuration = () => {
        const departure = parseISO(firstSegment.DepartureTime);
        const arrival = parseISO(lastSegment.ArrivalTime);
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

    const calculateTotalLayoverTime = () => {
        if (segments.length <= 1) return "";

        let totalLayoverMinutes = 0;
        for (let i = 0; i < segments.length - 1; i++) {
            const arrival = parseISO(segments[i].ArrivalTime);
            const departure = parseISO(segments[i + 1].DepartureTime);
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

    const renderFlightPath = () => {
        if (segments.length === 1) {
            // Direct flight
            return (
                <div className="flex items-center justify-between px-4 py-3">
                    {/* Departure */}
                    <div className="text-center min-w-0 flex-1">
                        <div className="text-xl font-bold text-foreground">
                            {formatTime(firstSegment.DepartureTime)}
                        </div>
                        <div className="text-muted-foreground text-xs">
                            {firstSegment.Origin}{" "}
                            {formatDate(firstSegment.DepartureTime)}
                        </div>
                    </div>

                    {/* Flight path */}
                    <div className="flex-1 mx-4 relative">
                        <div className="flex items-center justify-center mb-1">
                            <div className="text-xs text-muted-foreground px-2 py-1 rounded-full">
                                {calculateTotalDuration()}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="h-0.5 bg-muted-foreground/30 w-full"></div>
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div>
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div>
                            {/* <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <Plane className="h-4 w-4 text-primary" />
                            </div> */}
                        </div>
                        <div className="text-center mt-1">
                            <Badge variant="secondary" className="text-xs">
                                Direct
                            </Badge>
                        </div>
                    </div>

                    {/* Arrival */}
                    <div className="text-center min-w-0 flex-1">
                        <div className="text-xl font-bold text-foreground">
                            {formatTime(lastSegment.ArrivalTime)}
                            {isNextDay(
                                firstSegment.DepartureTime,
                                lastSegment.ArrivalTime
                            ) && (
                                <span className="text-xs text-destructive ml-1">
                                    +1
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {lastSegment.Destination}{" "}
                            {formatDate(lastSegment.ArrivalTime)}
                        </div>
                    </div>
                </div>
            );
        } else {
            // Connecting flights
            return (
                <div className="px-4 py-3">
                    {/* Main route overview */}
                    <div className="flex items-center justify-between mb-4">
                        {/* Departure */}
                        <div className="text-center">
                            <div className="text-xl font-bold text-foreground">
                                {formatTime(firstSegment.DepartureTime)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {firstSegment.Origin}{" "}
                                {formatDate(firstSegment.DepartureTime)}
                            </div>
                        </div>

                        {/* Journey overview */}
                        <div className="flex-1 mx-4 text-center">
                            <div className="text-xs text-muted-foreground mb-5">
                                {calculateTotalDuration()}
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
                                    {calculateTotalLayoverTime()}
                                </Badge>
                            </div>
                        </div>

                        {/* Arrival */}
                        <div className="text-center">
                            <div className="text-xl font-bold text-foreground">
                                {formatTime(lastSegment.ArrivalTime)}
                                {isNextDay(
                                    firstSegment.DepartureTime,
                                    lastSegment.ArrivalTime
                                ) && (
                                    <sup className="text-xs text-destructive ml-1">
                                        +1
                                    </sup>
                                )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {lastSegment.Destination}{" "}
                                {formatDate(lastSegment.ArrivalTime)}
                            </div>
                        </div>
                    </div>
                </div>
            );
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
                className="hover:shadow-lg transition-all duration-300  cursor-pointer sm:cursor-default py-2"
                onClick={handleCardClick}
            >
                <CardContent className="p-0">
                    {/* Main flight path */}
                    {renderFlightPath()}

                    {/* Divider */}
                    <div className="border-t border-border/50"></div>

                    {/* Footer with price and details */}
                    <div className="px-4 py-3">
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
                                        width={30}
                                        height={30}
                                        onError={(e) => {
                                            e.src =
                                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iIzk0YTNiOCIvPgo8L3N2Zz4K";
                                        }}
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

                                {/* Flight details */}
                                <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Luggage className="h-3 w-3" />
                                        <span>{CabinLuggage}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right side - Price and select button */}
                            <div className="text-right">
                                <div className="flex items-center gap-3">
                                    <div>
                                        <div className="text-sm text-muted-foreground">
                                            Total Price
                                        </div>
                                        <div className="text-2xl font-bold  text-accent-500">
                                            {SITECurrencyType} {TotalPrice}
                                        </div>

                                        {/* Desktop Select Button - under price */}
                                        <div className="hidden sm:block mt-2">
                                            <Button
                                                onClick={handleSelectFlight}
                                                size="sm"
                                                className="w-full"
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
