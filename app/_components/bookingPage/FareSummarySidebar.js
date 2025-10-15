import React, { useState } from "react";
import { ArrowRight, Info, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlightDetailsDialog } from "../flightSearchNavWrapper/FlightDetailsDialog";
import { useCurrency } from "@/app/_context/CurrencyContext";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFormatBaggage } from "@/app/_hooks/useFormatBaggage";
import { cn } from "@/lib/utils";

export default function FareSummarySidebar({
    totalPrice,
    basePrice,
    taxes,
    fareType,
    refundable,
    holdBooking,
    segments,
    onProceedToPayment,
    ticket,
}) {
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const { formatPrice } = useCurrency();
    const { formatBaggage } = useFormatBaggage();

    const { CabinLuggage, BaggageAllowance } = ticket;

    return (
        <div
            className="
            rounded-2xl border border-border bg-white/80 dark:bg-gray-800/50 
            backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300
            p-6 space-y-6 sticky top-6
        "
        >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 className="text-xl font-semibold capitalize rtl:text-right text-primary-700 dark:text-primary-100">
                    flight summary
                </h3>

                {segments && (
                    <FlightDetailsDialog
                        ticket={ticket}
                        isOpen={showDetailsDialog}
                        onClose={() => setShowDetailsDialog(!showDetailsDialog)}
                        withContinue={false}
                        trigger={{
                            title: "Details",
                            icon: <Ticket className="w-4 h-4" />,
                        }}
                    />
                )}
            </div>

            {/* Baggage Info */}
            <div className="pb-4 border-b border-border space-y-4">
                <h4 className="text-md font-semibold text-primary-600 dark:text-primary-200 rtl:text-right">
                    Baggage
                </h4>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <Tooltip>
                            <TooltipTrigger className="text-sm">
                                <span className="text-muted-foreground border-b-1 border-gray-600 dark:border-b-gray-400 border-dashed flex items-center gap-1">
                                    <Info className="size-3" />
                                    Personal item
                                </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[220px] text-xs leading-snug text-center">
                                <p>
                                    Baggage rules vary by airline. Please
                                    confirm your allowance before traveling.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                        <span className="text-green-600 font-semibold">
                            Free
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <Tooltip>
                            <TooltipTrigger className="text-sm">
                                <span className="text-muted-foreground border-b-1 border-gray-600 dark:border-b-gray-400 border-dashed flex items-center gap-1">
                                    <Info className="size-3" /> Carry-on baggage
                                </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[220px] text-xs leading-snug text-center">
                                <p>
                                    Baggage rules vary by airline. Please
                                    confirm your allowance before traveling.
                                </p>
                            </TooltipContent>
                        </Tooltip>

                        <span
                            className={cn(
                                " font-semibold capitalize",
                                `${
                                    formatBaggage(
                                        CabinLuggage
                                    ).toLocaleLowerCase() != "not included"
                                        ? "text-green-600"
                                        : "text-red-500 "
                                }`
                            )}
                        >
                            {formatBaggage(CabinLuggage)}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <Tooltip>
                            <TooltipTrigger className="text-sm">
                                <span className="text-muted-foreground border-b-1 border-gray-600 dark:border-b-gray-400 border-dashed flex items-center gap-1">
                                    <Info className="size-3" />
                                    Checked baggage
                                </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[220px] text-xs leading-snug text-center">
                                <p>
                                    Baggage rules vary by airline. Please
                                    confirm your allowance before traveling.
                                </p>
                            </TooltipContent>
                        </Tooltip>

                        <span
                            className={cn(
                                " font-semibold capitalize",
                                `${
                                    formatBaggage(
                                        BaggageAllowance[0]
                                    ).toLocaleLowerCase() != "not included"
                                        ? "text-green-600"
                                        : "text-red-500 "
                                }`
                            )}
                        >
                            {formatBaggage(BaggageAllowance[0])}
                        </span>
                    </div>
                </div>
            </div>

            {/* Fare Details */}
            <div className="space-y-4">
                <h4 className="text-md font-semibold text-primary-600 dark:text-primary-200 rtl:text-right capitalize">
                    price Details
                </h4>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Base Fare</span>
                        <span className="font-semibold text-primary-700 dark:text-primary-200">
                            {formatPrice(basePrice)}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                            Taxes & Fees
                        </span>
                        <span className="font-semibold text-primary-700 dark:text-primary-200">
                            {formatPrice(taxes)}
                        </span>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border"></div>

                {/* Total */}
                <div className="flex justify-between items-center font-semibold">
                    <span className="text-lg text-primary-700 dark:text-primary-200">
                        Total Amount
                    </span>
                    <span
                        className="
                        text-2xl font-bold bg-gradient-to-r from-accent-500 to-accent-400 
                        bg-clip-text text-transparent 
                    "
                    >
                        {formatPrice(totalPrice)}
                    </span>
                </div>

                {/* Badges */}
                {/* <div className="flex flex-wrap gap-2 pt-2">
                    <Badge
                        variant={isRefundable ? "default" : "secondary"}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                            isRefundable
                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                        }`}
                    >
                        {isRefundable ? (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                Refundable
                            </>
                        ) : (
                            <>
                                <XCircle className="w-4 h-4" />
                                Non-Refundable
                            </>
                        )}
                    </Badge>

                    {holdBooking === "YES" && (
                        <Badge
                            variant="outline"
                            className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 rounded-full px-3 py-1"
                        >
                            Hold Booking
                        </Badge>
                    )}
                </div> */}

                {/* Additional Info */}
                {/* <div className="pt-4 border-t border-border">
                    <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                        <li>Price may change due to availability</li>
                        <li>Additional baggage fees may apply</li>
                        <li>Seats subject to availability</li>
                    </ul>
                </div> */}
            </div>

            {/* Proceed Button */}
            {onProceedToPayment && (
                <Button
                    onClick={onProceedToPayment}
                    className="
                    w-full py-5 text-md font-semibold
                    bg-gradient-to-r from-accent-500 to-accent-400
                    hover:from-accent-600 hover:to-accent-500
                    text-white shadow-md hover:shadow-lg
                    transition-all duration-300 cursor-pointer rounded-sm
                        "
                >
                    Proceed to Payment
                    <ArrowRight className="w-5 h-5 ltr:ml-2 rtl:mr-2" />
                </Button>
            )}
        </div>
    );
}
