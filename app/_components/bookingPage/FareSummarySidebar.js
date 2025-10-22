"use client";
import React, { useState } from "react";
import { Info, Loader2, Ticket } from "lucide-react";
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
import { useTranslations } from "use-intl";
import ChevronBasedOnLanguage from "../ChevronBasedOnLanguage";
import useBookingStore from "@/app/_store/bookingStore";

export default function FareSummarySidebar({ onProceedToPayment, loading }) {
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const { formatPrice } = useCurrency();
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
                <h4 className="text-md font-semibold text-primary-600 dark:text-primary-200 rtl:text-right">
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
                <h4 className="text-md font-semibold text-primary-600 dark:text-primary-200 rtl:text-right capitalize">
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
                        {formatPrice(totalPrice)}
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
    const { formatPrice } = useCurrency();
    return (
        <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-semibold text-green-600 dark:text-green-400">
                +{formatPrice(value)}
            </span>
        </div>
    );
}

// import React, { useState } from "react";
// import { ArrowRight, Info, Loader2, Ticket } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { FlightDetailsDialog } from "../flightSearchNavWrapper/FlightDetailsDialog";
// import { useCurrency } from "@/app/_context/CurrencyContext";
// import {
//     Tooltip,
//     TooltipContent,
//     TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { useFormatBaggage } from "@/app/_hooks/useFormatBaggage";
// import { cn } from "@/lib/utils";
// import { useTranslations } from "use-intl";
// import ChevronBasedOnLanguage from "../ChevronBasedOnLanguage";
// import useBookingStore from "@/app/_store/bookingStore";

// export default function FareSummarySidebar({
//     totalPrice,
//     basePrice,
//     taxes,
//     insuranceTotal, // prop جديد
//     segments,
//     onProceedToPayment,
//     ticket,
//     loading,
// }) {
//     const [showDetailsDialog, setShowDetailsDialog] = useState(false);
//     const { formatPrice } = useCurrency();
//     const { formatBaggage } = useFormatBaggage();
//     const { CabinLuggage, BaggageAllowance } = ticket;
//     const f = useTranslations("Flight");

//     const { baggagePrice, mealPrice, selectedBaggage, selectedMeal } =
//         useBookingStore((state) => state.addOns);

//     return (
//         <div
//             className="
//             rounded-2xl border border-border bg-white/80 dark:bg-gray-800/50
//             backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300
//             p-6 space-y-6 sticky top-6
//         "
//         >
//             {/* Header */}
//             <div className="flex items-center justify-between pb-4 border-b border-border">
//                 <h3 className="text-xl font-semibold capitalize rtl:text-right text-primary-700 dark:text-primary-100">
//                     {f("booking.flight_summary")}
//                 </h3>

//                 {segments && (
//                     <FlightDetailsDialog
//                         ticket={ticket}
//                         isOpen={showDetailsDialog}
//                         onClose={() => setShowDetailsDialog(!showDetailsDialog)}
//                         withContinue={false}
//                         trigger={{
//                             title: f("booking.details"),
//                             icon: <Ticket className="w-4 h-4" />,
//                         }}
//                     />
//                 )}
//             </div>

//             {/* Baggage Info */}
//             <div className="pb-4 border-b border-border space-y-4">
//                 <h4 className="text-md font-semibold text-primary-600 dark:text-primary-200 rtl:text-right">
//                     {f("booking.baggage")}
//                 </h4>
//                 <div className="space-y-3">
//                     <div className="flex justify-between text-sm">
//                         <Tooltip>
//                             <TooltipTrigger className="text-sm">
//                                 <span className="text-muted-foreground border-b-1 border-gray-600 dark:border-b-gray-400 border-dashed flex items-center gap-1">
//                                     <Info className="size-3" />
//                                     {f("booking.personal_item")}
//                                 </span>
//                             </TooltipTrigger>
//                             <TooltipContent className="max-w-[220px] text-xs leading-snug text-center">
//                                 <p>{f("booking.baggage_helper")}</p>
//                             </TooltipContent>
//                         </Tooltip>
//                         <span className="text-green-600 font-semibold">
//                             {f("booking.free")}
//                         </span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                         <Tooltip>
//                             <TooltipTrigger className="text-sm">
//                                 <span className="text-muted-foreground border-b-1 border-gray-600 dark:border-b-gray-400 border-dashed flex items-center gap-1">
//                                     <Info className="size-3" />{" "}
//                                     {f("booking.cabin_baggage")}
//                                 </span>
//                             </TooltipTrigger>
//                             <TooltipContent className="max-w-[220px] text-xs leading-snug text-center">
//                                 <p>{f("booking.baggage_helper")}</p>
//                             </TooltipContent>
//                         </Tooltip>

//                         <span
//                             className={cn(
//                                 " font-semibold capitalize",
//                                 `${
//                                     formatBaggage(
//                                         CabinLuggage
//                                     ).toLocaleLowerCase() != "not included"
//                                         ? "text-green-600"
//                                         : "text-red-500 "
//                                 }`
//                             )}
//                         >
//                             {formatBaggage(CabinLuggage)}
//                         </span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                         <Tooltip>
//                             <TooltipTrigger className="text-sm">
//                                 <span className="text-muted-foreground border-b-1 border-gray-600 dark:border-b-gray-400 border-dashed flex items-center gap-1">
//                                     <Info className="size-3" />
//                                     {f("booking.checked_baggage")}
//                                 </span>
//                             </TooltipTrigger>
//                             <TooltipContent className="max-w-[220px] text-xs leading-snug text-center">
//                                 <p>{f("booking.baggage_helper")}</p>
//                             </TooltipContent>
//                         </Tooltip>

//                         <span
//                             className={cn(
//                                 " font-semibold capitalize",
//                                 `${
//                                     formatBaggage(
//                                         BaggageAllowance[0]
//                                     ).toLocaleLowerCase() != "not included"
//                                         ? "text-green-600"
//                                         : "text-red-500 "
//                                 }`
//                             )}
//                         >
//                             {formatBaggage(BaggageAllowance[0])}
//                         </span>
//                     </div>
//                 </div>
//             </div>

//             {/* Fare Details */}
//             <div className="space-y-4">
//                 <h4 className="text-md font-semibold text-primary-600 dark:text-primary-200 rtl:text-right capitalize">
//                     {f("booking.price_details")}
//                 </h4>
//                 <div className="space-y-3">
//                     <div className="flex justify-between text-sm">
//                         <span className="text-muted-foreground">
//                             {f("booking.base_fare")}
//                         </span>
//                         <span className="font-semibold text-primary-700 dark:text-primary-200">
//                             {formatPrice(basePrice)}
//                         </span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                         <span className="text-muted-foreground">
//                             {f("booking.taxes_and_fees")}
//                         </span>
//                         <span className="font-semibold text-primary-700 dark:text-primary-200">
//                             {formatPrice(taxes)}
//                         </span>
//                     </div>

//                     {/* Baggage Row   */}
//                     {baggagePrice > 0 && (
//                         <div className="flex justify-between text-sm">
//                             <span className="text-muted-foreground">
//                                 {f("booking.extra_baggage_summary")}
//                             </span>
//                             <span className="font-semibold text-green-600 dark:text-green-400">
//                                 +{formatPrice(baggagePrice)}
//                             </span>
//                         </div>
//                     )}

//                     {/* Meals Row   */}
//                     {mealPrice > 0 && (
//                         <div className="flex justify-between text-sm">
//                             <span className="text-muted-foreground">
//                                 {f("booking.meals")}
//                             </span>
//                             <span className="font-semibold text-green-600 dark:text-green-400">
//                                 +{formatPrice(mealPrice)}
//                             </span>
//                         </div>
//                     )}

//                     {/* Insurance Row  */}
//                     {insuranceTotal > 0 && (
//                         <div className="flex justify-between text-sm">
//                             <span className="text-muted-foreground">
//                                 {f("insurance.title")}
//                             </span>
//                             <span className="font-semibold text-green-600 dark:text-green-400">
//                                 +{formatPrice(insuranceTotal)}
//                             </span>
//                         </div>
//                     )}
//                 </div>

//                 {/* Divider */}
//                 <div className="border-t border-border"></div>

//                 {/* Total */}
//                 <div className="flex justify-between items-center font-semibold">
//                     <span className="text-lg text-primary-700 dark:text-primary-200">
//                         {f("booking.total_fare")}
//                     </span>
//                     <span className="text-2xl font-bold bg-gradient-to-r from-accent-500 to-accent-400 bg-clip-text text-transparent">
//                         {formatPrice(totalPrice)}
//                     </span>
//                 </div>

//                 {/* Badges */}
//                 {/* <div className="flex flex-wrap gap-2 pt-2">
//                     <Badge
//                         variant={isRefundable ? "default" : "secondary"}
//                         className={`flex items-center gap-1 px-3 py-1 rounded-full ${
//                             isRefundable
//                                 ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
//                                 : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
//                         }`}
//                     >
//                         {isRefundable ? (
//                             <>
//                                 <CheckCircle2 className="w-4 h-4" />
//                                 Refundable
//                             </>
//                         ) : (
//                             <>
//                                 <XCircle className="w-4 h-4" />
//                                 Non-Refundable
//                             </>
//                         )}
//                     </Badge>

//                     {holdBooking === "YES" && (
//                         <Badge
//                             variant="outline"
//                             className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 rounded-full px-3 py-1"
//                         >
//                             Hold Booking
//                         </Badge>
//                     )}
//                 </div> */}

//                 {/* Additional Info */}
//                 {/* <div className="pt-4 border-t border-border">
//                     <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
//                         <li>Price may change due to availability</li>
//                         <li>Additional baggage fees may apply</li>
//                         <li>Seats subject to availability</li>
//                     </ul>
//                 </div> */}
//             </div>

//             {/* Proceed Button */}
//             {onProceedToPayment && (
//                 <Button
//                     onClick={onProceedToPayment}
//                     className="
//                     w-full py-5 text-md font-semibold
//                     bg-gradient-to-r from-accent-500 to-accent-400
//                     hover:from-accent-600 hover:to-accent-500
//                     text-white shadow-md hover:shadow-lg
//                     transition-all duration-300 cursor-pointer rounded-sm rtl:flex-row-reverse ltr:flex-row-reverse
//                         "
//                     disabled={loading}
//                 >
//                     {loading ? (
//                         <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                     ) : (
//                         <ChevronBasedOnLanguage size="5" />
//                     )}
//                     {f("booking.proceed_to_payment")}
//                 </Button>
//             )}
//         </div>
//     );
// }
