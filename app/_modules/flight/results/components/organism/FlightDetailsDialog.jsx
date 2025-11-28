"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogDescription,
    DialogHeader,
} from "@/components/ui/dialog";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/app/_modules/currency/hooks/useCurrency";
import { useDateFormatter } from "@/app/_hooks/useDisplayShortDate";
// === HOOKS & STATES ===
import { useFormatBaggage } from "../../hooks/useFormatBaggage";

// === NEW COMPONENTS (after refactor) ===
import FlightOverview from "../molecule/FlightOverview";
import SegmentsList from "./SegmentsList";
import PriceBreakdown from "../molecule/PriceBreakdown";
import FlightConditions from "../molecule/FlightConditions";
import ContinueFooter from "../molecule/ContinueFooter";
// === UTILS ===
import { calculateTotalDuration } from "../../utils/flightTimeUtils";
// === services ===
import { checkAirPricing } from "../../services/airPricingService";
import useBookingStore from "../../../booking/store/bookingStore";

export function FlightDetailsDialog({
    ticket,
    isOpen,
    onClose,
    withContinue = true,
    trigger = "",
}) {
    const router = useRouter();
    const t = useTranslations("Flight");
    const { formatPrice } = useCurrency();
    const { formatBaggage } = useFormatBaggage();
    const formatDate = useDateFormatter();

    const searchParams = useSearchParams();
    const searchInfo = JSON.parse(searchParams.get("searchObject"));
    const { departure, destination } =
        JSON.parse(searchParams.get("cities")) || {};

    const departureCity =
        departure?.city ||
        JSON.parse(sessionStorage.getItem("departure"))?.city;

    const destinationCity =
        destination?.city ||
        JSON.parse(sessionStorage.getItem("destination"))?.city;

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

    const isRoundTrip = MultiLeg === "true" && onward && returnJourney;
    const outboundSegments = isRoundTrip ? onward.segments : segments;
    const returnSegments = isRoundTrip ? returnJourney.segments : null;

    const firstSegment = outboundSegments[0];
    const lastSegment = outboundSegments[outboundSegments.length - 1];

    const [isChecking, setIsChecking] = useState(false);
    const [pricingError, setPricingError] = useState(null);

    const {
        setTicket,
        setSearchInfo,
        setSessionId,
        setTempId,
        clearBookingData,
        setSearchURL,
        setBaggageData,
        setPriceChangeData,
    } = useBookingStore();

    const handleContinue = async () => {
        setIsChecking(true);
        setPricingError(null);

        const pricingData = await checkAirPricing({
            rawRequestBase64,
            rawResponseBase64,
            originalPrice: TotalPrice,
        });

        if (pricingData.status === "error") {
            setPricingError(pricingData.message);
            setIsChecking(false);
            return;
        }

        switch (pricingData.status) {
            case "success": {
                clearBookingData();
                setTicket(ticket);
                setSearchInfo(searchInfo);
                setSessionId(pricingData.data.sessionId);
                setTempId(pricingData.data.tempId);

                //  Save the current search results URL so user can return if booking fails
                const currentSearchURL = window.location.href;

                setSearchURL(currentSearchURL);

                setBaggageData({
                    outward:
                        pricingData.data?.baggageData?.OutwardLuggageOptions ??
                        null,
                    return:
                        pricingData.data?.baggageData?.ReturnLuggageOptions ??
                        null,
                });

                router.push(
                    `/flights/booking?session_id=${pricingData.data.sessionId}&temp_id=${pricingData.data.tempId}`
                );
                break;
            }

            case "price_changed": {
                clearBookingData();

                // Update ticket with new price
                const updatedTicket = {
                    ...ticket,
                    TotalPrice: pricingData.data.newPrice,
                    BasePrice: pricingData.data.basePrice,
                    Taxes: pricingData.data.taxPrice,
                };

                setTicket(updatedTicket);
                setSearchInfo(searchInfo);
                setSessionId(pricingData.data.sessionId);
                setTempId(pricingData.data.tempId);

                // Set price change data for the popup
                setPriceChangeData({
                    oldPrice: pricingData.data.oldPrice,
                    newPrice: pricingData.data.newPrice,
                    currency: pricingData.data.currency,
                });

                // Save search URL
                const currentSearchURL = window.location.href;
                setSearchURL(currentSearchURL);

                router.push(
                    `/flights/booking?session_id=${pricingData.data.sessionId}&temp_id=${pricingData.data.tempId}`
                );
                break;
            }

            case "not_available":
                router.push("/flights/price-not-found");
                break;

            default:
                setPricingError("Unexpected response from server.");
        }

        setIsChecking(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* Trigger */}
            {!withContinue && trigger && (
                <DialogTrigger asChild>
                    <button className="text-blue-600 text-sm flex items-center gap-1">
                        {trigger.icon} {trigger.title}
                    </button>
                </DialogTrigger>
            )}

            {/* MAIN CONTENT */}
            <DialogContent
                className={cn(
                    "dialog-bg",
                    "max-w-none h-full overflow-auto rounded-none border-0 md:rounded sm:fixed sm:left-[87%]",
                    "open-slide-right close-slide-right"
                )}
            >
                <DialogHeader className="text-left rtl:text-right">
                    <DialogTitle>{t("dialog.flight_details")}</DialogTitle>
                    <DialogDescription>{t("dialog.guide")}</DialogDescription>
                </DialogHeader>

                <FlightOverview
                    t={t}
                    outboundSegments={outboundSegments}
                    returnSegments={returnSegments}
                    isRoundTrip={isRoundTrip}
                    departureCity={departureCity}
                    destinationCity={destinationCity}
                    firstSegment={firstSegment}
                    lastSegment={lastSegment}
                    formatDate={formatDate}
                    calculateTotalDuration={calculateTotalDuration}
                    TotalPrice={TotalPrice}
                    formatPrice={formatPrice}
                />

                <div className="space-y-6 mt-6">
                    <h4 className="font-semibold">
                        {t("dialog.flight_itinerary")}
                    </h4>

                    <SegmentsList
                        segments={outboundSegments}
                        title={
                            isRoundTrip
                                ? t("dialog.outbound_flight")
                                : t("dialog.flight_details")
                        }
                    />

                    {isRoundTrip && returnSegments && (
                        <SegmentsList
                            segments={returnSegments}
                            title={t("dialog.return_flight")}
                        />
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                    <PriceBreakdown
                        t={t}
                        BasePrice={BasePrice}
                        Taxes={Taxes}
                        TotalPrice={TotalPrice}
                        formatPrice={formatPrice}
                    />

                    <FlightConditions
                        t={t}
                        CabinLuggage={CabinLuggage}
                        BaggageAllowance={BaggageAllowance}
                        Refundable={Refundable}
                        formatBaggage={formatBaggage}
                    />
                </div>

                {withContinue && (
                    <ContinueFooter
                        t={t}
                        TotalPrice={TotalPrice}
                        isChecking={isChecking}
                        handleContinue={handleContinue}
                        formatPrice={formatPrice}
                    />
                )}

                {pricingError && (
                    <div className="p-3 bg-red-50 text-red-600 mt-3 rounded-lg text-sm">
                        {pricingError}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
