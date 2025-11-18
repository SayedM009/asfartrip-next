"use client";
import React, { useState } from "react";
import { Info, Loader2, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlightDetailsDialog } from "../flightSearchNavWrapper/FlightDetailsDialog";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFormatBaggage } from "@/app/_hooks/useFormatBaggage";
import { cn } from "@/lib/utils";
import { useTranslations } from "use-intl";
import ChevronBasedOnLanguage from "../../ui/ChevronBasedOnLanguage";
import useBookingStore from "@/app/_store/bookingStore";
import AnimatedPrice from "../../ui/AnimatedPrice";
import { useCurrencyStore } from "@/app/_store/useCurrencyStore";

export default function FareSummarySidebar({ onProceedToPayment, loading }) {
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const { formatPrice } = useCurrencyStore();
    const { formatBaggage } = useFormatBaggage();
    const f = useTranslations("Flight");

    // ✅ استخدم Zustand مباشرة
    const { ticket, addOns, getTotalPrice, getInsuranceTotal } =
        useBookingStore();

    const { baggagePrice, mealPrice } = addOns;
    const insuranceTotal = getInsuranceTotal();
    const totalPrice = getTotalPrice();

    const {
        CabinLuggage,
        BaggageAllowance,
        BasePrice,
        Taxes,
        SITECurrencyType,
    } = ticket || {};

    return (
        <div className="rounded-2xl border border-border bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg p-6 space-y-6 sticky top-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 className="text-xl font-semibold capitalize rtl:text-right text-primary-700 dark:text-primary-100">
                    {f("booking.flight_summary")}
                </h3>
                {ticket?.segments && (
                    <FlightDetailsDialog
                        ticket={ticket}
                        isOpen={showDetailsDialog}
                        onClose={() => setShowDetailsDialog(!showDetailsDialog)}
                        withContinue={false}
                        trigger={{
                            title: f("booking.details"),
                            icon: <Ticket className="w-4 h-4" />,
                        }}
                    />
                )}
            </div>

            {/* Baggage Info */}
            <div className="pb-4 border-b border-border space-y-4">
                <h4 className="text-md font-semibold text-primary-600 dark:text-primary-200 rtl:text-right text-left">
                    {f("booking.baggage")}
                </h4>

                <div className="flex justify-between text-sm">
                    <Tooltip>
                        <TooltipTrigger className="text-sm">
                            <span className="text-muted-foreground border-b-1 border-gray-600 dark:border-b-gray-400 border-dashed flex items-center gap-1">
                                <Info className="size-3" />
                                {f("booking.personal_item")}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[220px] text-xs leading-snug text-center">
                            <p>{f("booking.baggage_helper")}</p>
                        </TooltipContent>
                    </Tooltip>
                    <span className="text-green-600 font-semibold">
                        {f("booking.free")}
                    </span>
                </div>
                {/* Cabin + Checked */}
                {[
                    { label: f("booking.cabin_baggage"), value: CabinLuggage },
                    {
                        label: f("booking.checked_baggage"),
                        value: BaggageAllowance?.[0],
                    },
                ].map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                        <Tooltip>
                            <TooltipTrigger className="text-sm">
                                <span className="text-muted-foreground border-b-1 border-gray-600 dark:border-b-gray-400 border-dashed flex items-center gap-1">
                                    <Info className="size-3" /> {item.label}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[220px] text-xs leading-snug text-center">
                                <p>{f("booking.baggage_helper")}</p>
                            </TooltipContent>
                        </Tooltip>
                        <span
                            className={cn(
                                "font-semibold capitalize",
                                formatBaggage(item.value).toLowerCase() !==
                                    "not included"
                                    ? "text-green-600"
                                    : "text-red-500"
                            )}
                        >
                            {formatBaggage(item.value)}
                        </span>
                    </div>
                ))}
            </div>

            {/* Price Details */}
            <div className="space-y-4">
                <h4 className="text-md font-semibold text-primary-600 dark:text-primary-200 rtl:text-right capitalize text-left">
                    {f("booking.price_details")}
                </h4>

                {[
                    { label: f("booking.base_fare"), value: BasePrice },
                    { label: f("booking.taxes_and_fees"), value: Taxes },
                ].map((row, i) => (
                    <div key={i} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                            {row.label}
                        </span>
                        <span className="font-semibold text-primary-700 dark:text-primary-200">
                            {formatPrice(row.value)}
                        </span>
                    </div>
                ))}

                {baggagePrice > 0 && (
                    <PriceRow
                        label={f("booking.extra_baggage_summary")}
                        value={baggagePrice}
                    />
                )}
                {mealPrice > 0 && (
                    <PriceRow label={f("booking.meals")} value={mealPrice} />
                )}
                {insuranceTotal > 0 && (
                    <PriceRow
                        label={f("insurance.title")}
                        value={insuranceTotal}
                    />
                )}

                <div className="border-t border-border"></div>

                <div className="flex justify-between items-center font-semibold">
                    <span className="text-lg text-primary-700 dark:text-primary-200">
                        {f("booking.total_fare")}
                    </span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-accent-500 to-accent-400 bg-clip-text text-transparent">
                        <AnimatedPrice basePrice={totalPrice} duration={1} />
                        {/* {formatPrice(totalPrice)} */}
                    </span>
                </div>
            </div>

            {onProceedToPayment && (
                <Button
                    onClick={onProceedToPayment}
                    className="
                    w-full py-5 text-md font-semibold
                    bg-gradient-to-r from-accent-500 to-accent-400
                    hover:from-accent-600 hover:to-accent-500
                    text-white shadow-md hover:shadow-lg
                    transition-all duration-300 cursor-pointer rounded-sm rtl:flex-row-reverse ltr:flex-row-reverse
                        "
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        <ChevronBasedOnLanguage size="5" />
                    )}
                    {f("booking.proceed_to_payment")}
                </Button>
            )}
        </div>
    );
}

function PriceRow({ label, value }) {
    const { formatPrice } = useCurrencyStore();
    return (
        <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-semibold text-green-600 dark:text-green-400">
                +{formatPrice(value)}
            </span>
        </div>
    );
}
