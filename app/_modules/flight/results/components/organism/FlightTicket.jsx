"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTranslations } from "next-intl";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import { useCurrency } from "@/app/_modules/currency/hooks/useCurrency";
import { useDateFormatter } from "@/app/_hooks/useDisplayShortDate";

// Utils
import { getAirlineLogo } from "../../utils/flightHelpers";
// Molecules
import SingleJourney from "../molecule/SingleJourney";
import RoundTripJourney from "../molecule/RoundTripJourney";
// Dialog
import { FlightDetailsDialog } from "./FlightDetailsDialog";
import LoyaltyPoints from "@/app/_modules/loyalty/components/organisms/LoyaltyPoints";

export default function FlightTicket({
    ticket,
    onSelect,
    isFastest,
    isCheapest,
}) {
    const { formatPrice } = useCurrency();
    const { isRTL } = useCheckLocal();
    const t = useTranslations("Flight");
    const formatDate = useDateFormatter();

    const [showDetailsDialog, setShowDetailsDialog] = useState(false);

    const {
        TotalPrice,
        MultiLeg,
        segments,
        onward,
        return: returnJourney,
    } = ticket;

    const isRoundTrip = MultiLeg === "true" && onward && returnJourney;

    const displaySegments = isRoundTrip ? onward.segments : segments;
    const firstSegment = displaySegments[0];

    // Pattern (based on locale)
    const pattern = isRTL ? "EEEE d MMMM" : "EEE, MMM d";

    const openDialog = () => setShowDetailsDialog(true);
    const closeDialog = () => setShowDetailsDialog(false);

    const continueToBooking = () => {
        setShowDetailsDialog(false);
        onSelect?.();
    };

    return (
        <>
            <Card
                onClick={openDialog}
                className={`
                hover:shadow-lg transition-all duration-300 sm:cursor-default pt-3 pb-0 dark:shadow-gray-600
                ${
                    isCheapest
                        ? "border-[3px] border-green-500"
                        : isFastest
                        ? "border-[3px] border-accent-400"
                        : "border border-transparent"
                }
                relative
                `}
            >
                <CardContent className="p-0 cursor-pointer">
                    {/* LABELS CONTAINER */}
                    {(isCheapest || isFastest) && (
                        <div
                            className={`absolute top-[-2px] z-10 flex gap-1 ${
                                isRTL ? "left-[-2px]" : "right-[-2px]"
                            }`}
                        >
                            {/* FASTEST Label */}
                            {isFastest && (
                                <span
                                    className={`bg-accent-400 text-white text-[10px] font-semibold p-2 uppercase ${
                                        isRTL
                                            ? "rounded-tl-lg rounded-br-lg"
                                            : "rounded-tr-lg rounded-bl-lg"
                                    }`}
                                >
                                    {t("filters.fastest")}
                                </span>
                            )}
                            {/* CHEAPEST Label */}
                            {isCheapest && (
                                <span
                                    className={`bg-green-500 text-white text-[10px] font-semibold p-2 uppercase ${
                                        isRTL
                                            ? "rounded-tl-lg rounded-br-lg"
                                            : "rounded-tr-lg rounded-bl-lg"
                                    }`}
                                >
                                    {t("filters.cheapest")}
                                </span>
                            )}
                        </div>
                    )}

                    {/* ==========================
                        MAIN FLIGHT PATH
                    =========================== */}
                    {!isRoundTrip ? (
                        <SingleJourney
                            segments={displaySegments}
                            t={t}
                            formatDate={(d) => formatDate(d, { pattern })}
                        />
                    ) : (
                        <RoundTripJourney
                            onward={onward}
                            returnJourney={returnJourney}
                            t={t}
                            formatDate={(d) => formatDate(d, { pattern })}
                        />
                    )}

                    {/* Divider */}
                    <div className="border-t border-border/50"></div>

                    {/* ==========================
                        FOOTER (AIRLINE + PRICE)
                    =========================== */}
                    <div className="py-2 px-4">
                        <div className="flex items-center justify-between">
                            {/* Airline */}
                            <div className="flex items-center gap-3">
                                <Image
                                    src={`/airline_logo/${firstSegment.Carrier}.png`}
                                    alt={firstSegment.Carrier}
                                    className="w-8 h-8 rounded"
                                    width={30}
                                    height={30}
                                    loading="lazy"
                                    onError={(e) => {
                                        e.currentTarget.src = getAirlineLogo(
                                            firstSegment.Carrier
                                        );
                                    }}
                                />
                                <div>
                                    <div className="font-medium text-sm">
                                        {t(
                                            `airlines.${firstSegment.Carrier}`
                                        ) || firstSegment.Carrier}
                                    </div>
                                    <div className="text-xs text-muted-foreground capitalize">
                                        {t(
                                            `ticket_class.${String(
                                                firstSegment.CabinClass
                                            ).toLowerCase()}`
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex flex-col items-center gap-0.5">
                                <div className="text-[10px] md:text-xs text-muted-foreground">
                                    {t("total_price")}
                                </div>

                                <div className="font-extrabold text-accent-500 ">
                                    {formatPrice(
                                        TotalPrice,
                                        "orange",
                                        20,
                                        "text-3xl "
                                    )}
                                </div>

                                {/* Desktop Select Button */}
                                <div className="hidden sm:block mb-2">
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openDialog();
                                        }}
                                        className="btn-primary"
                                    >
                                        {t("select_flight")}
                                    </Button>
                                </div>

                                <LoyaltyPoints price={TotalPrice} />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ==========================
                FLIGHT DETAILS DIALOG
            =========================== */}
            <FlightDetailsDialog
                ticket={ticket}
                isOpen={showDetailsDialog}
                onClose={closeDialog}
                onContinue={continueToBooking}
            />
        </>
    );
}
