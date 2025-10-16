import React from "react";
import { Shield, CheckCircle2, Circle } from "lucide-react";
import { useCurrency } from "@/app/_context/CurrencyContext";
import { useTranslations } from "next-intl";

export function InsuranceSelection({
    options,
    selectedInsurance,
    onInsuranceChange,
    totalPassengers = 1,
}) {
    const { formatPrice } = useCurrency();
    const f = useTranslations("Flight");

    // Add "No Insurance" option at the beginning
    const allOptions = [
        {
            quote_id: 0,
            scheme_id: 0,
            name: f("insurance.no_insurance"),
            premium: 0,
        },
        ...(options || []),
    ];

    const getTotalPrice = (premium) => {
        return premium * totalPassengers;
    };

    // الحصول على العملة من أول خيار تأمين (إذا وجد)
    const currency =
        options && options.length > 0 ? options[0].currency : "USD";

    return (
        <div className="bg-white dark:bg-transparent rounded-lg border border-border p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-accent-100 dark:bg-accent-900/30 p-2 rounded-lg">
                    <Shield className="w-5 h-5 text-accent-600 dark:text-accent-400" />
                </div>
                <div>
                    <h2 className="rtl:text-right">{f("insurance.title")}</h2>
                    <p className="text-sm text-muted-foreground rtl:text-right">
                        {f("insurance.description")}
                    </p>
                </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
                {allOptions.map((option) => {
                    const isSelected =
                        selectedInsurance?.scheme_id === option.scheme_id;
                    const totalPrice = getTotalPrice(option.premium);

                    return (
                        <div key={option.scheme_id || option.quote_id}>
                            <button
                                type="button"
                                onClick={() => {
                                    onInsuranceChange(option);
                                }}
                                className={`
                  w-full flex items-center justify-between gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${
                      isSelected
                          ? "border-accent-600 dark:border-accent-500 bg-accent-50 dark:bg-accent-900/30 shadow-sm"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                  }
                `}
                            >
                                {/* Left side: Icon + Name */}
                                <div className="flex items-center gap-3 flex-1 min-w-0 text-left rtl:text-right">
                                    {isSelected ? (
                                        <CheckCircle2 className="w-5 h-5 text-accent-600 dark:text-accent-400 shrink-0" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0" />
                                    )}
                                    <span
                                        className={`${
                                            isSelected
                                                ? "text-accent-600 dark:text-accent-400 font-medium"
                                                : "text-accent-900 dark:text-accent-100"
                                        } rtl:text-right truncate`}
                                    >
                                        {option.name}
                                    </span>
                                </div>

                                {/* Right side: Price */}
                                <div className="text-right shrink-0 rtl:text-left">
                                    {option.premium > 0 ? (
                                        <>
                                            <div
                                                className={`${
                                                    isSelected
                                                        ? "text-accent-600 dark:text-accent-400 font-medium"
                                                        : "text-gray-900 dark:text-gray-100"
                                                }`}
                                            >
                                                {formatPrice(totalPrice)}{" "}
                                                {currency}
                                            </div>
                                            {totalPassengers > 1 && (
                                                <div className="text-xs text-muted-foreground">
                                                    {option.premium.toFixed(2)}{" "}
                                                    {currency} ×{" "}
                                                    {totalPassengers}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-muted-foreground">
                                            {f("insurance.free")}
                                        </div>
                                    )}
                                </div>
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
// import React from "react";
// import { Shield, CheckCircle2, Circle } from "lucide-react";

// export function InsuranceSelection({
//     options,
//     selectedInsurance,
//     onInsuranceChange,
//     totalPassengers = 1,
// }) {
//     // Add "No Insurance" option at the beginning
//     const allOptions = [
//         {
//             quote_id: 0,
//             scheme_id: 0,
//             name: "No Insurance",
//             premium: 0,
//         },
//         ...options,
//     ];

//     const getTotalPrice = (premium) => {
//         return premium * totalPassengers;
//     };

//     return (
//         <div className="bg-white dark:bg-gray-800 rounded-lg border border-border p-6">
//             {/* Header */}
//             <div className="flex items-center gap-3 mb-6">
//                 <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
//                     <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//                 </div>
//                 <div>
//                     <h2 className="rtl:text-right">Travel Insurance</h2>
//                     <p className="text-sm text-muted-foreground rtl:text-right">
//                         Protect your trip with comprehensive travel insurance
//                     </p>
//                 </div>
//             </div>

//             {/* Options */}
//             <div className="space-y-3">
//                 {allOptions.map((option) => {
//                     const isSelected =
//                         selectedInsurance ===
//                         (option.scheme_id === 0 ? null : option.scheme_id);
//                     const totalPrice = getTotalPrice(option.premium);

//                     return (
//                         <div key={option.scheme_id}>
//                             <button
//                                 type="button"
//                                 onClick={() => {
//                                     const schemeId = option.scheme_id;
//                                     onInsuranceChange(
//                                         schemeId === 0 ? null : schemeId,
//                                         option.premium
//                                     );
//                                 }}
//                                 className={`
//                   w-full flex items-center justify-between gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
//                   ${
//                       isSelected
//                           ? "border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-sm"
//                           : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
//                   }
//                 `}
//                             >
//                                 {/* Left side: Icon + Name */}
//                                 <div className="flex items-center gap-3 flex-1 min-w-0 text-left rtl:text-right">
//                                     {isSelected ? (
//                                         <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
//                                     ) : (
//                                         <Circle className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0" />
//                                     )}
//                                     <span
//                                         className={`${
//                                             isSelected
//                                                 ? "text-blue-600 dark:text-blue-400"
//                                                 : ""
//                                         } rtl:text-right truncate`}
//                                     >
//                                         {option.name}
//                                     </span>
//                                 </div>

//                                 {/* Right side: Price */}
//                                 <div className="text-right shrink-0 rtl:text-left">
//                                     {option.premium > 0 ? (
//                                         <>
//                                             <div
//                                                 className={`${
//                                                     isSelected
//                                                         ? "text-blue-600 dark:text-blue-400"
//                                                         : ""
//                                                 }`}
//                                             >
//                                                 {totalPrice.toFixed(2)}
//                                             </div>
//                                             {totalPassengers > 1 && (
//                                                 <div className="text-xs text-muted-foreground">
//                                                     {option.premium.toFixed(2)}{" "}
//                                                     × {totalPassengers}
//                                                 </div>
//                                             )}
//                                         </>
//                                     ) : (
//                                         <div className="text-muted-foreground">
//                                             Free
//                                         </div>
//                                     )}
//                                 </div>
//                             </button>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }
