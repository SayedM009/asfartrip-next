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

export function FlightDetailsDialog({
    ticket,
    isOpen,
    onClose,
    withContinue = true,
}) {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(false);
    const [pricingError, setPricingError] = useState(null);

    const {
        TotalPrice,
        BasePrice,
        Taxes,
        SITECurrencyType,
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

    function formatBaggage(baggage) {
        if (!baggage) return t("baggage.not_included");

        let text = String(baggage).trim();
        text = text.replace("NumberOfPieces", t("baggage.pieces"));
        text = text.replace("Kilograms", t("baggage.Kilograms"));

        const match = text.match(/(\D+)\s*(\d+)/);
        if (match) {
            const [, word, number] = match;
            return `${number} ${word.trim()}`;
        }

        const match2 = text.match(/(\d+)\s*(\D+)/);
        if (match2) {
            const [, number, word] = match2;
            return `${number} ${word.trim()}`;
        }

        return text;
    }

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

            console.log("📊 Pricing result:", pricingData);

            switch (pricingData.status) {
                case "success": {
                    console.log("✅ Price confirmed, saving ticket...");

                    // 1️⃣ Save the ticket in temporary API
                    const saveRes = await fetch("/api/flight/temp-flights", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ticket }),
                    });

                    const saveData = await saveRes.json();
                    if (!saveRes.ok)
                        throw new Error(
                            saveData.error || "Failed to save ticket"
                        );

                    console.log(
                        "💾 Ticket saved with temp_id:",
                        saveData.temp_id
                    );

                    // 2️⃣ Redirect to booking page
                    router.push(
                        `/flights/booking?session_id=${pricingData.data.sessionId}&temp_id=${saveData.temp_id}`
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
                <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <Image
                            src={`/airline_logo/${segment.Carrier}.png`}
                            alt={segment.Carrier}
                            className="w-8 h-8 rounded"
                            onError={(e) => {
                                e.currentTarget.src = `https://images.kiwi.com/airlines/64x64/${segment.Carrier}.png`;
                            }}
                            loading="lazy"
                            width={30}
                            height={30}
                        />
                        <div>
                            <div className="font-medium">
                                {t(`airlines.${segment.Carrier}`) ||
                                    segment.Carrier}{" "}
                                {segment.FlightNumber}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {segment.Equipment} •{" "}
                                {t(
                                    `ticket_class.${String(
                                        segment.CabinClass
                                    ).toLowerCase()}`
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Departure */}
                        <div>
                            <div className="font-semibold text-lg">
                                {formatTime(segment.DepartureTime)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {formatDate(segment.DepartureTime, {
                                    pattern: "EEEE, d MMMM ",
                                })}
                            </div>
                            <div className="font-medium">{segment.Origin}</div>
                            <div className="text-sm text-muted-foreground">
                                {segment.OriginAirport}
                            </div>
                            {segment.OriginTerminal && (
                                <div className="text-sm text-muted-foreground">
                                    {t("dialog.terminal")}{" "}
                                    {segment.OriginTerminal}
                                </div>
                            )}
                        </div>

                        {/* Flight Duration */}
                        <div className="text-center flex flex-col justify-center">
                            <div className="text-sm text-muted-foreground mb-1">
                                {t("dialog.flight_time")}: {segment.Duration}
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
                            <div className="font-semibold text-lg">
                                {formatTime(segment.ArrivalTime)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {formatDate(segment.ArrivalTime, {
                                    pattern: "EEEE, d MMMM ",
                                })}
                            </div>
                            <div className="font-medium">
                                {segment.Destination}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {segment.DestinationAirport}
                            </div>
                            {segment.DestinationTerminal && (
                                <div className="text-sm text-muted-foreground">
                                    {t("dialog.terminal")}{" "}
                                    {segment.DestinationTerminal}
                                </div>
                            )}
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
            {!withContinue && (
                <DialogTrigger asChild>
                    <button>click me</button>
                </DialogTrigger>
            )}
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
                    <DialogTitle className="flex items-center gap-2" dir="ltr">
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
                                <h3 className="font-semibold">
                                    {firstSegment.Origin} →{" "}
                                    {lastSegment.Destination}
                                    {isRoundTrip && (
                                        <span className="ml-2 text-sm font-normal">
                                            {t("round_trip")}
                                        </span>
                                    )}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {t("departure")}:{" "}
                                    {formatDate(firstSegment.DepartureTime, {
                                        pattern: "EEEE, MMMM d, yyyy",
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
                                <div className="text-xs font-bold text-accent-400">
                                    {formatPrice(TotalPrice)}
                                </div>
                                <div className="text-xs text-muted-foreground">
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
                            <div className="flex items-center gap-2 text-sm">
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
                                    <span>{formatPrice(BasePrice)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{t("dialog.taxes_fees")}</span>
                                    <span>{formatPrice(Taxes)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-semibold">
                                    <span>{t("dialog.total_price")}</span>
                                    <span className="text-accent-400">
                                        {formatPrice(TotalPrice)}
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
                            <div className="flex-1 flex items-center gap-10">
                                <div className="flex justify-between font-semibold text-sm gap-2">
                                    <span>{t("dialog.total_price")}</span>
                                    <span className="text-accent-400">
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
                                        {t("dialog.confiming")}
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
