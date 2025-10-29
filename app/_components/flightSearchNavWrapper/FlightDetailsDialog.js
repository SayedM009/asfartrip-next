"use client";
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Plane,
    Clock,
    Luggage,
    CreditCard,
    AlertCircle,
    Backpack,
    Loader2,
} from "lucide-react";
import { format, parseISO, differenceInMinutes } from "date-fns";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useDateFormatter } from "@/app/_hooks/useDisplayShortDate";
import { useCurrency } from "@/app/_context/CurrencyContext";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import useBookingStore from "@/app/_store/bookingStore";
import { useFormatBaggage } from "@/app/_hooks/useFormatBaggage";
import ChevronBasedOnLanguage from "../ChevronBasedOnLanguage";
import LoyaltyPoints from "../loyaltyPoints/LoyaltyPoints";

export function FlightDetailsDialog({
    ticket,
    isOpen,
    onClose,
    withContinue = true,
    trigger = "",
}) {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(false);
    const [pricingError, setPricingError] = useState(null);
    const { formatBaggage } = useFormatBaggage();

    const {
        TotalPrice,
        BasePrice,
        Taxes,
        Refundable,
        MultiLeg,
        segments,
        onward,
        return: returnJourney,
        CabinLuggage,
        BaggageAllowance,
        rawRequestBase64,
        rawResponseBase64,
    } = ticket;

    const t = useTranslations("Flight");
    const formatDate = useDateFormatter();
    const { formatPrice } = useCurrency();
    const searchParams = useSearchParams();
    const searchInfo = JSON.parse(searchParams.get("searchObject"));

    const { departure, destination } =
        JSON.parse(searchParams.get("cities")) || {};

    const departureCity =
        departure?.city || JSON.parse(sessionStorage.getItem("departure")).city;
    const destinationCity =
        destination?.city ||
        JSON.parse(sessionStorage.getItem("destination")).city;

    const {
        setTicket,
        setSearchInfo,
        setSessionId,
        setTempId,
        clearBookingData,
        setSearchURL,
        setBaggageData,
    } = useBookingStore();

    // Determine if this is a round trip ticket
    const isRoundTrip = MultiLeg === "true" && onward && returnJourney;

    // Get segments for display
    const outboundSegments = isRoundTrip ? onward.segments : segments;
    const returnSegments = isRoundTrip ? returnJourney.segments : null;

    const firstSegment = outboundSegments[0];
    const lastSegment = outboundSegments[outboundSegments.length - 1];

    const formatTime = (isoString) => {
        return format(parseISO(isoString), "HH:mm");
    };

    const calculateLayoverTime = (arrivalTime, nextDepartureTime) => {
        const arrival = parseISO(arrivalTime);
        const departure = parseISO(nextDepartureTime);
        const layoverMinutes = differenceInMinutes(departure, arrival);
        const hours = Math.floor(layoverMinutes / 60);
        const minutes = layoverMinutes % 60;
        return `${hours}h ${minutes}m`
            .replace("h", t("h"))
            .replace("m", t("m"));
    };

    const calculateTotalDuration = (segmentsArray) => {
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

    /**
     * Handle Continue button - Check air pricing
     */

    const handleContinue = async () => {
        if (!rawRequestBase64 || !rawResponseBase64) {
            setPricingError("Missing flight data. Please search again.");
            return;
        }

        setIsChecking(true);
        setPricingError(null);

        try {
            console.log("🔍 Checking air pricing...");

            const pricingRes = await fetch("/api/flight/air-pricing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    request: rawRequestBase64,
                    response: rawResponseBase64,
                    originalPrice: TotalPrice,
                }),
            });

            const pricingData = await pricingRes.json();
            if (!pricingRes.ok)
                throw new Error(pricingData.error || "Failed to check pricing");

            switch (pricingData.status) {
                case "success": {
                    // 1️. Save the ticket & SearchInfo in bookingStore
                    setTicket(ticket);
                    console.log(searchInfo);
                    setSearchInfo(searchInfo);
                    setSessionId(pricingData.data.sessionId);
                    setTempId(pricingData.data.tempId);
                    setSearchURL(window.location.href);
                    setBaggageData({
                        outward:
                            pricingData.data.baggageData.outwardLuggageOptions,
                        return: pricingData.data.baggageData
                            .returnLuggageOptions,
                    });
                    clearBookingData();

                    // 2. Save Departure & Destination in Case of there are no Objects in Session Storage
                    if (
                        !JSON.parse(sessionStorage.getItem("departure")) ||
                        !JSON.parse(sessionStorage.getItem("destination"))
                    ) {
                        sessionStorage.setItem(
                            "departure",
                            JSON.stringify(departure)
                        );
                        sessionStorage.setItem(
                            "destination",
                            JSON.stringify(destination)
                        );
                    }

                    // 3. Redirect to booking page
                    router.push(
                        `/flights/booking?session_id=${pricingData.data.sessionId}&temp_id=${pricingData.data.tempId}`
                    );
                    break;
                }

                case "price_changed":
                    console.warn("⚠️ Price changed:", pricingData.data);
                    setPricingError(
                        `Price has changed from ${formatPrice(
                            pricingData.data.oldPrice
                        )} to ${formatPrice(
                            pricingData.data.newPrice
                        )}. Please review and continue.`
                    );

                    if (
                        confirm(
                            pricingData.message +
                                `\n\nNew Price: ${formatPrice(
                                    pricingData.data.totalPrice
                                )}\n\nContinue?`
                        )
                    ) {
                        // Optional: You can re-run save + redirect here too if needed
                        router.push(
                            `/booking?session_id=${pricingData.data.sessionId}&temp_id=${pricingData.data.tempId}`
                        );
                    }
                    break;

                case "not_available":
                    console.log("❌ Flight not available");
                    router.push("/price-not-found");
                    break;

                default:
                    throw new Error(
                        pricingData.message || "Unexpected response from server"
                    );
            }
        } catch (err) {
            console.error("❌ Error:", err);
            setPricingError(err.message || "An unexpected error occurred.");
        } finally {
            setIsChecking(false);
        }
    };

    const renderFlightSegments = (segments, title) => (
        <div className="space-y-4">
            <h5 className="font-medium text-primary">{title}</h5>
            {segments.map((segment, index) => (
                <div key={index} className="border rounded-lg px-2 py-4 sm:p-4">
                    <div className="flex gap-4">
                        {/* Departure */}
                        <div className="flex flex-col justify-between">
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
                            <div className="text-sm text-muted-foreground mb-1">
                                <Badge
                                    variant="secondary"
                                    className="w-full p-2"
                                >
                                    {String(
                                        String(segment.Duration)
                                            .split(":")
                                            .join("h ") + "m"
                                    )
                                        .replace("h", t("h"))
                                        .replace("m", t("m"))}
                                </Badge>
                            </div>
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

                        {/* Flight Duration */}
                        <div className="text-center flex flex-col justify-center">
                            <div className="relative">
                                <div className="h-50 bg-muted-foreground/30 w-0.5"></div>
                                <div className="absolute left-0 top-0 transform -translate-x-0.5 w-2 h-2 bg-primary rounded-full"></div>
                                <div className="absolute left-0 bottom-0 transform -translate-x-0.5 w-2 h-2 bg-primary rounded-full"></div>
                            </div>
                        </div>

                        {/* Arrival */}
                        <div className="flex flex-col justify-between relative ">
                            <div>
                                <div className="font-medium flex items-center gap-2">
                                    {segment.Origin}
                                    <span>
                                        {segment.OriginTerminal && (
                                            <div className="text-sm text-muted-foreground">
                                                {t("dialog.terminal")}{" "}
                                                {segment.OriginTerminal}
                                            </div>
                                        )}
                                    </span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {segment.OriginAirport}
                                </div>
                            </div>
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
                            <div>
                                <div className="font-medium flex items-center gap-2">
                                    {/* <div className="absolute left-[-9%] sm:left-[-9.5%] rtl:right-[-9%] rtl:sm:right-[-9.5%] bottom-6 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div> */}
                                    {segment.Destination}
                                    <span>
                                        {segment.DestinationTerminal && (
                                            <div className="text-sm text-muted-foreground">
                                                {t("dialog.terminal")}{" "}
                                                {segment.DestinationTerminal}
                                            </div>
                                        )}
                                    </span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {segment.DestinationAirport}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Layover Information */}
                    {index < segments.length - 1 && (
                        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                                <Clock className="h-4 w-4" />
                                <span className="font-medium">
                                    {t(`dialog.layover`, {
                                        city: segment.Destination,
                                        time: calculateLayoverTime(
                                            segment.ArrivalTime,
                                            segments[index + 1].DepartureTime
                                        ),
                                    })}
                                </span>
                            </div>
                            <div className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                {t("baggage.recheck_baggage")}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {!withContinue ? (
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 text-sm"
                    >
                        {trigger.icon} {trigger.title}
                    </Button>
                </DialogTrigger>
            ) : null}
            <DialogContent
                className={cn(
                    "dialog-bg",
                    "max-w-none h-full overflow-auto rounded-none border-0 md:rounded sm:fixed sm:left-[87%]",
                    "open-slide-right",
                    "close-slide-right",
                    `overflow-x-hidden ${withContinue ? "pb-0" : "pb-4"}`
                )}
            >
                <DialogHeader>
                    <DialogTitle className="flex  gap-2">
                        <Plane className="h-5 w-5" />
                        {t("dialog.flight_details")}
                    </DialogTitle>
                    <DialogDescription>{t("dialog.guide")}</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Flight Overview */}
                    <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="font-semibold flex items-center capitalize gap-2">
                                    <span>
                                        {departureCity || firstSegment.Origin}
                                    </span>
                                    <ChevronBasedOnLanguage icon="arrow" />
                                    <span>
                                        {destinationCity ||
                                            lastSegment.Destination}
                                    </span>
                                    {isRoundTrip && (
                                        <span className="ml-2 text-sm font-normal">
                                            {t("round_trip")}
                                        </span>
                                    )}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {t("departure")}:{" "}
                                    {formatDate(firstSegment.DepartureTime, {
                                        pattern: "EEEE, d MMMM , yyyy",
                                    })}
                                    {isRoundTrip && returnSegments && (
                                        <span className="block">
                                            {t("filters.return")}:{" "}
                                            {formatDate(
                                                returnSegments[0].DepartureTime,
                                                {
                                                    pattern:
                                                        "EEEE, MMMM d, yyyy",
                                                }
                                            )}
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-accent-400">
                                    {formatPrice(TotalPrice, undefined, 12)}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {isRoundTrip
                                        ? "Total round trip"
                                        : `${t(
                                              "dialog.journey"
                                          )}: ${calculateTotalDuration(
                                              outboundSegments
                                          )}`}
                                </div>
                            </div>
                        </div>

                        {(outboundSegments.length > 1 ||
                            (returnSegments && returnSegments.length > 1)) && (
                            <div className="flex items-center gap-2 text-xs">
                                <AlertCircle className="h-4 w-4 text-amber-500" />
                                <span>{t("dialog.check_visa")}</span>
                            </div>
                        )}
                    </div>

                    {/* Detailed Flight Segments */}
                    <div className="space-y-6">
                        <h4 className="font-semibold">
                            {t("dialog.flight_itinerary")}
                        </h4>

                        {/* Outbound Journey */}
                        {renderFlightSegments(
                            outboundSegments,
                            isRoundTrip
                                ? t("dialog.outbound_flight")
                                : t("dialog.flight_details")
                        )}

                        {/* Return Journey (if round trip) */}
                        {isRoundTrip && returnSegments && (
                            <div className="mt-8">
                                {renderFlightSegments(
                                    returnSegments,
                                    t("dialog.return_flight")
                                )}
                            </div>
                        )}
                    </div>

                    {/* Price Breakdown and Additional Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Price Breakdown */}
                        <div className="space-y-3">
                            <h4 className="font-semibold">
                                {t("dialog.price_breakdown")}
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>{t("dialog.base_price")}</span>
                                    <span>
                                        {formatPrice(BasePrice, undefined, 12)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{t("dialog.taxes_fees")}</span>
                                    <span>
                                        {formatPrice(Taxes, undefined, 12)}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-semibold">
                                    <span>{t("dialog.total_price")}</span>
                                    <span className="text-accent-400">
                                        {formatPrice(TotalPrice, undefined, 12)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Flight Conditions */}
                        <div className="space-y-3">
                            <h4 className="font-semibold">
                                {t("dialog.flight_conditions")}
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <Backpack className="h-4 w-4" />
                                    <span>
                                        {t("baggage.cabin_luggage")}:{" "}
                                        {formatBaggage(CabinLuggage)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Luggage className="h-4 w-4" />
                                    <span>
                                        {t("baggage.checked_baggage")}:{" "}
                                        {formatBaggage(BaggageAllowance[0])}
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
                                            ? t("filters.refundable")
                                            : t("filters.non_Refundable")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {pricingError && (
                        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <div className="flex items-start gap-2 text-red-800 dark:text-red-200">
                                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                <p className="text-sm">{pricingError}</p>
                            </div>
                        </div>
                    )}
                </div>

                {withContinue && (
                    <DialogFooter className="sticky bottom-0 w-full p-3 bg-white dark:bg-muted rounded-t-2xl">
                        <div className="flex flex-col items-center sm:flex-row gap-3 pt-4 w-full">
                            <div className="flex-1 w-full flex items-center justify-between sm:items-start sm:flex-col ">
                                <LoyaltyPoints />
                                <div className="flex justify-between items-center font-semibold  gap-2">
                                    <span className="text-xs">
                                        {t("dialog.total_price")}
                                    </span>
                                    <span className="text-accent-400 text-lg">
                                        {formatPrice(TotalPrice)}
                                    </span>
                                </div>
                            </div>
                            <Button
                                onClick={handleContinue}
                                className="btn-primary flex-1"
                                disabled={isChecking}
                            >
                                {isChecking ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        {t("dialog.checking")}
                                    </>
                                ) : (
                                    t("dialog.continue")
                                )}
                            </Button>
                        </div>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
