import React, { useState } from "react";
import { CheckCircle2, XCircle, Info, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FlightDetailsDialog } from "../flightSearchNavWrapper/FlightDetailsDialog";
import { useCurrency } from "@/app/_context/CurrencyContext";

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

    const isRefundable =
        refundable === "true" ||
        fareType?.toLowerCase()?.includes("refundable");

    return (
        <div
            className="
            rounded-2xl border border-border bg-white/80 dark:bg-gray-800/70 
            backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300
            p-6 space-y-6 sticky top-6
        "
        >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 className="text-xl font-semibold capitalize rtl:text-right text-primary-700 dark:text-primary-100">
                    Price Details
                </h3>

                {segments && (
                    <FlightDetailsDialog
                        ticket={ticket}
                        isOpen={showDetailsDialog}
                        onClose={() => setShowDetailsDialog(!showDetailsDialog)}
                        withContinue={false}
                        trigger={{
                            title: "Details",
                            icon: <Info className="w-4 h-4" />,
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
                        <span className="text-muted-foreground">
                            Personal item
                        </span>
                        <span className="text-gray-700 dark:text-gray-200">
                            Check with airline
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                            Carry-on baggage
                        </span>
                        <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                            Checked baggage
                        </span>
                        <span className="text-red-500 font-medium">
                            Not included
                        </span>
                    </div>
                </div>
            </div>

            {/* Fare Details */}
            <div className="space-y-4">
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
                        bg-clip-text text-transparent drop-shadow-sm
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

// import React, { useState } from "react";
// import { CheckCircle2, XCircle, Info, ArrowRight } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { FlightDetailsDialog } from "../flightSearchNavWrapper/FlightDetailsDialog";
// import { useCurrency } from "@/app/_context/CurrencyContext";
// // import { FlightDetailsDialogBooking } from "./FlightDetailsDialogBooking";

// export default function FareSummarySidebar({
//     totalPrice,
//     basePrice,
//     taxes,
//     currency,
//     fareType,
//     refundable,
//     holdBooking,
//     segments,
//     cabinLuggage,
//     baggageAllowance,
//     onProceedToPayment,
//     ticket,
// }) {
//     const [showDetailsDialog, setShowDetailsDialog] = useState(false);

//     const { formatPrice } = useCurrency();

//     const isRefundable =
//         refundable === "true" || fareType.toLowerCase().includes("refundable");

//     <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 text-sm">
//         <Info className="w-4 h-4" />
//         Details
//     </button>;

//     return (
//         <div className="bg-white dark:bg-gray-800 rounded-lg border border-border p-6 shadow-sm sticky top-4 space-y-6">
//             <div className="flex items-center justify-between pb-4 border-b border-border">
//                 <h3 className="rtl:text-right capitalize font-semibold text-xl">
//                     price details
//                 </h3>
//                 {segments && (
//                     <FlightDetailsDialog
//                         ticket={ticket}
//                         isOpen={showDetailsDialog}
//                         onClose={() => setShowDetailsDialog(!showDetailsDialog)}
//                         withContinue={false}
//                         trigger={{ title: "Details", icon: <Info /> }}
//                     />
//                 )}
//             </div>

//             <div className="pb-4 border-b border-border">
//                 <h2 className="rtl:text-right capitalize font-semibold text-md mb-5">
//                     Baggage
//                 </h2>
//                 <div className="space-y-4">
//                     <div className="space-y-3">
//                         <div className="flex justify-between text-sm rtl:flex-row-reverse">
//                             <span className="text-muted-foreground">
//                                 Personal item
//                             </span>
//                             <span className="">Check with airline</span>
//                         </div>
//                         <div className="flex justify-between text-sm rtl:flex-row-reverse">
//                             <span className="text-muted-foreground">
//                                 Carry-on baggage
//                             </span>
//                             <span className="">Free</span>
//                         </div>
//                         <div className="flex justify-between text-sm rtl:flex-row-reverse">
//                             <span className="text-muted-foreground">
//                                 Checked baggage
//                             </span>
//                             <span className="">Not included</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="space-y-4">
//                 {/* Fare Details */}
//                 <div className="space-y-3">
//                     <div className="flex justify-between text-sm rtl:flex-row-reverse">
//                         <span className="text-muted-foreground">Base Fare</span>
//                         <span className="text-accent-500 font-semibold">
//                             {/* {currency} {basePrice.toFixed(2)}  */}
//                             {formatPrice(basePrice)}
//                         </span>
//                     </div>
//                     <div className="flex justify-between text-sm rtl:flex-row-reverse">
//                         <span className="text-muted-foreground">
//                             Taxes & Fees
//                         </span>
//                         <span className="text-accent-500 font-semibold">
//                             {/* {currency} {taxes.toFixed(2)} */}
//                             {formatPrice(taxes)}
//                         </span>
//                     </div>
//                 </div>

//                 {/* Divider */}
//                 <div className="border-t border-border"></div>

//                 {/* Total */}
//                 <div className="flex justify-between items-center rtl:flex-row-reverse font-semibold">
//                     <span className="text-xl">Total Amount</span>
//                     <span className="text-2xl text-accent-500 dark:text-accent-400 ">
//                         {/* {currency} {totalPrice.toFixed(2)} */}
//                         {formatPrice(totalPrice)}
//                     </span>
//                 </div>

//                 {/* Badges */}
//                 <div className="flex flex-wrap gap-2 pt-2">
//                     <Badge
//                         variant={isRefundable ? "default" : "secondary"}
//                         className="flex items-center gap-1"
//                     >
//                         {isRefundable ? (
//                             <>
//                                 <CheckCircle2 className="w-3 h-3" />
//                                 Refundable
//                             </>
//                         ) : (
//                             <>
//                                 <XCircle className="w-3 h-3" />
//                                 Non-Refundable
//                             </>
//                         )}
//                     </Badge>

//                     {holdBooking === "YES" && (
//                         <Badge
//                             variant="outline"
//                             className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
//                         >
//                             Hold Booking
//                         </Badge>
//                     )}
//                 </div>

//                 {/* Additional Info */}
//                 <div className="pt-4 border-t border-border">
//                     <div className="text-xs text-muted-foreground space-y-1.5">
//                         <p>• Price may change due to availability</p>
//                         <p>• Additional baggage fees may apply</p>
//                         <p>• Seats subject to availability</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Proceed to Payment Button */}
//             {onProceedToPayment && (
//                 <Button
//                     onClick={onProceedToPayment}
//                     className="btn-primary "
//                     size="lg"
//                 >
//                     Proceed to Payment
//                     <ArrowRight className="w-4 h-4 ltr:ml-2 rtl:mr-2" />
//                 </Button>
//             )}
//         </div>
//     );
// }
