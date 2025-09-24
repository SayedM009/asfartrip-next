"use client";
import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plane, Clock, Luggage, CreditCard, AlertCircle } from "lucide-react";
import { format, parseISO, differenceInMinutes } from "date-fns";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Airline code to name mapping - you can expand this or connect to an API
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

export function FlightDetailsDialog({ ticket, isOpen, onClose, onContinue }) {
    const {
        TotalPrice,
        BasePrice,
        Taxes,
        SITECurrencyType,
        FareType,
        Refundable,
        segments,
        CabinLuggage,
        BaggageAllowance,
    } = ticket;

    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];

    const formatTime = (isoString) => {
        return format(parseISO(isoString), "HH:mm");
    };

    const formatFullDate = (isoString) => {
        return format(parseISO(isoString), "EEEE, MMMM d, yyyy");
    };

    const formatDate = (isoString) => {
        return format(parseISO(isoString), "EEE, MMM d");
    };

    const calculateLayoverTime = (arrivalTime, nextDepartureTime) => {
        const arrival = parseISO(arrivalTime);
        const departure = parseISO(nextDepartureTime);
        const layoverMinutes = differenceInMinutes(departure, arrival);
        const hours = Math.floor(layoverMinutes / 60);
        const minutes = layoverMinutes % 60;
        return `${hours}h ${minutes}m`;
    };

    const calculateTotalDuration = () => {
        const departure = parseISO(firstSegment.DepartureTime);
        const arrival = parseISO(lastSegment.ArrivalTime);
        const totalMinutes = differenceInMinutes(arrival, departure);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes}m`;
    };

    const getAirlineLogo = (carrier) => {
        return `https://images.kiwi.com/airlines/64x64/${carrier}.png`;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className={cn(
                    "dialog-bg",
                    "max-w-none w-full h-full overflow-auto rounded-none border-0 sm:h-full md:rounded sm:right-0",
                    "open-slide-right",
                    "close-slide-right"
                )}
            >
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Plane className="h-5 w-5" />
                        Flight Details
                    </DialogTitle>
                    {/* <DialogDescription>
                        Review complete flight information including itinerary,
                        pricing, and booking conditions before continuing to
                        checkout.
                    </DialogDescription> */}
                </DialogHeader>

                <div className="space-y-6">
                    {/* Flight Overview */}
                    <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-semibold">
                                    {firstSegment.Origin} →{" "}
                                    {lastSegment.Destination}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {formatFullDate(firstSegment.DepartureTime)}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold">
                                    {SITECurrencyType} {TotalPrice}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Total tirp: {calculateTotalDuration()}
                                </div>
                            </div>
                        </div>

                        {segments.length > 1 && (
                            <div className="flex items-center gap-2 text-xs">
                                <AlertCircle className="h-4 w-4 text-amber-500" />
                                <span>
                                    {segments.length - 1}{" "}
                                    {segments.length === 2 ? "stop" : "stops"} •
                                    Check visa requirements for connecting
                                    airports
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Detailed Flight Segments */}
                    <div className="space-y-4">
                        <h4 className="font-semibold">Flight Itinerary</h4>

                        {segments.map((segment, index) => (
                            <div key={index} className="border rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <Image
                                        src={getAirlineLogo(segment.Carrier)}
                                        alt={segment.Carrier}
                                        className=" rounded"
                                        width={30}
                                        height={30}
                                        onError={(e) => {
                                            e.src =
                                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iIzk0YTNiOCIvPgo8L3N2Zz4K";
                                        }}
                                    />
                                    <div>
                                        <div className="font-medium">
                                            {getAirlineName(segment.Carrier)}{" "}
                                            {segment.FlightNumber}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {segment.Equipment} •{" "}
                                            {segment.CabinClass}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Departure */}
                                    <div>
                                        <div className="font-semibold text-lg flex items-center gap-2">
                                            {formatTime(segment.DepartureTime)}
                                            <div className="text-sm text-muted-foreground">
                                                {formatDate(
                                                    segment.DepartureTime
                                                )}
                                            </div>
                                        </div>

                                        <div className="font-medium flex items-center gap-2">
                                            {segment.Origin}
                                            <div className="text-sm text-muted-foreground">
                                                {segment.OriginAirport}
                                            </div>

                                            {segment.OriginTerminal && (
                                                <div className="text-sm text-muted-foreground">
                                                    Terminal{" "}
                                                    {segment.OriginTerminal}
                                                </div>
                                            )}
                                        </div>

                                        {/* {segment.OriginTerminal && (
                                            <div className="text-sm text-muted-foreground">
                                                Terminal{" "}
                                                {segment.OriginTerminal}
                                            </div>
                                        )} */}
                                    </div>

                                    {/* Flight Duration */}
                                    <div className="text-center flex flex-col justify-center">
                                        <div className="text-sm text-muted-foreground mb-1">
                                            Flight time: {segment.Duration}
                                        </div>
                                        <div className="relative">
                                            <div className="h-0.5 bg-muted-foreground/30 w-full"></div>
                                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div>
                                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div>
                                            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                <Plane className="h-3 w-3 text-primary" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Arrival */}
                                    <div className="text-right md:text-left">
                                        <div className="font-semibold text-lg flex items-center  gap-2 flex-row-reverse">
                                            <div className="text-sm text-muted-foreground">
                                                {formatDate(
                                                    segment.ArrivalTime
                                                )}
                                            </div>
                                            {formatTime(segment.ArrivalTime)}
                                        </div>

                                        <div className="font-medium flex items-center gap-2 justify-end">
                                            {segment.Destination}
                                            <div className="text-sm text-muted-foreground">
                                                {segment.DestinationAirport}
                                            </div>
                                            {segment.DestinationTerminal && (
                                                <div className="text-sm text-muted-foreground">
                                                    Terminal{" "}
                                                    {
                                                        segment.DestinationTerminal
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Layover Information */}
                                {index < segments.length - 1 && (
                                    <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                                        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                                            <Clock className="h-4 w-4" />
                                            <span className="font-medium">
                                                Layover in {segment.Destination}
                                                :{" "}
                                                {calculateLayoverTime(
                                                    segment.ArrivalTime,
                                                    segments[index + 1]
                                                        .DepartureTime
                                                )}
                                            </span>
                                        </div>
                                        <div className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                            You will need to collect and
                                            re-check your baggage if required
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Price Breakdown and Additional Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Price Breakdown */}
                        <div className="space-y-3">
                            <h4 className="font-semibold">Price Breakdown</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Base Price</span>
                                    <span>
                                        {SITECurrencyType} {BasePrice}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Taxes & Fees</span>
                                    <span>
                                        {SITECurrencyType} {Taxes}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-semibold">
                                    <span>Total Price</span>
                                    <span>
                                        {SITECurrencyType} {TotalPrice}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Flight Conditions */}
                        <div className="space-y-3">
                            <h4 className="font-semibold">Flight Conditions</h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <Luggage className="h-4 w-4" />
                                    <span>Cabin Luggage: {CabinLuggage}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Luggage className="h-4 w-4" />
                                    <span>
                                        Checked Baggage:{" "}
                                        {BaggageAllowance[0] || "Not included"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <CreditCard className="h-4 w-4" />
                                    <span
                                        className={
                                            Refundable
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }
                                    >
                                        {Refundable
                                            ? "Refundable"
                                            : "Non-refundable"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Back to Results
                        </Button>
                        <Button onClick={onContinue} className="flex-1">
                            Continue to Booking
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
