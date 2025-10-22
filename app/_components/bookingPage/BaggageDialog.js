"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Package, Luggage, Users } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import useBookingStore from "@/app/_store/bookingStore";
import { useCurrency } from "@/app/_context/CurrencyContext";
import { useTranslations } from "use-intl";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import { useFormatBaggage } from "@/app/_hooks/useFormatBaggage";

export default function BaggageDialog({ trigger }) {
    const f = useTranslations("Flight");
    const t = useTranslations("Traveler");
    const { formatBaggage } = useFormatBaggage();
    const { formatPrice } = useCurrency();
    const { travelers, baggageData, addOns, setBaggageData, updateBaggage } =
        useBookingStore();
    const { isRTL } = useCheckLocal();
    const direction = isRTL ? "rtl" : "ltr";

    // 🧩 بيانات تجريبية (في التطبيق الفعلي هتيجي من API)
    // useEffect(() => {
    //     setBaggageData({
    //         outbound: [
    //             "1,No baggage,0,Outbound,true",
    //             "2,25 Kg 1 Piece,30,Outbound,true",
    //             "3,40 Kg 2 Pieces,120,Outbound,true",
    //         ],
    //         inbound: [
    //             "1,No baggage,0,Inbound,true",
    //             "2,20 Kg 1 Piece,25,Inbound,true",
    //             "3,30 Kg 2 Pieces,60,Inbound,true",
    //         ],
    //     });
    // }, [setBaggageData]);

    const [open, setOpen] = useState(false);
    const [selectedBaggage, setSelectedBaggage] = useState({
        outbound: [],
        inbound: [],
    });

    // ✅ عند فتح الـ Dialog، استرجاع القيم المحفوظة
    useEffect(() => {
        if (open) {
            setSelectedBaggage(
                addOns.selectedBaggage || { outbound: [], inbound: [] }
            );
        }
    }, [open, addOns.selectedBaggage]);

    // ✅ خيارات افتراضية في حال عدم وجود بيانات
    const defaultOptions = [
        { label: "No baggage", price: 0 },
        { label: "30 Kg 1 Piece", price: 35 },
        { label: "40 Kg 2 Pieces", price: 120 },
    ];

    // ✅ معالجة البيانات القادمة من API
    const outboundOptions = useMemo(() => {
        if (!baggageData?.outbound) return defaultOptions;
        try {
            return baggageData.outbound.map((item) => {
                const [, label, price] = item.split(",");
                return { label, price: parseFloat(price) };
            });
        } catch {
            return defaultOptions;
        }
    }, [baggageData?.outbound]);

    const inboundOptions = useMemo(() => {
        if (!baggageData?.inbound) return [];
        try {
            return baggageData.inbound.map((item) => {
                const [, label, price] = item.split(",");
                return { label, price: parseFloat(price) };
            });
        } catch {
            return [];
        }
    }, [baggageData?.inbound]);

    // ✅ حساب السعر الإجمالي
    const totalPrice = useMemo(() => {
        const calcTotal = (items) =>
            items?.reduce((sum, x) => sum + (Number(x?.price) || 0), 0) || 0;
        return (
            calcTotal(selectedBaggage.outbound) +
            calcTotal(selectedBaggage.inbound)
        );
    }, [selectedBaggage.outbound, selectedBaggage.inbound]);

    // ✅ عند اختيار الحقائب
    const handleSelect = (type, passenger, value) => {
        const options = type === "outbound" ? outboundOptions : inboundOptions;
        const selectedOption = options.find((opt) => opt.label === value) || {
            label: "No baggage",
            price: 0,
        };

        setSelectedBaggage((prev) => {
            const updated = [...(prev[type] || [])];
            const existingIndex = updated.findIndex(
                (x) => x.passengerId === passenger.travelerNumber
            );

            if (existingIndex > -1) {
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    ...selectedOption,
                };
            } else {
                updated.push({
                    passengerId: passenger.travelerNumber,
                    ...selectedOption,
                });
            }

            const cleaned = updated.filter(
                (x) => x.label !== "No baggage" || x.price > 0
            );
            return { ...prev, [type]: cleaned };
        });
    };

    // ✅ عند الضغط على "حفظ"
    const handleSave = () => {
        updateBaggage(selectedBaggage, totalPrice);
        setOpen(false);
    };

    if (!baggageData?.outbound && !baggageData?.inbound) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button
                        variant="outline"
                        className="w-full justify-between h-14 px-5 cursor-pointer"
                    >
                        <span className="flex items-center gap-3">
                            <div className="bg-accent-100 dark:bg-accent-900/30 p-2 rounded-lg">
                                <Luggage className="size-5 text-accent-600" />
                            </div>
                            <span>{f("booking.extra_baggage")}</span>
                        </span>
                        {totalPrice > 0 && (
                            <span className="text-accent-600">
                                +{formatPrice(totalPrice)}
                            </span>
                        )}
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="max-w-2xl h-full sm:max-h-[95vh] overflow-y-auto rounded-none sm:rounded-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        {f("booking.baggage_information")}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-8 py-4">
                    {/* ================= OUTBOUND SECTION ================= */}
                    {baggageData?.outbound && (
                        <section>
                            <h3 className="font-semibold mb-3 text-lg text-primary-700 dark:text-primary-300">
                                {f("booking.outbound_baggage")}
                            </h3>
                            <div className="space-y-3">
                                {travelers.map((traveler) => (
                                    <div
                                        key={`outbound-${traveler.travelerNumber}`}
                                        className="flex items-center justify-between gap-3 p-3 border rounded-md bg-white dark:bg-gray-900"
                                    >
                                        <div className="flex items-center gap-2 text-sm">
                                            <Users className="w-4 h-4 text-accent-500" />
                                            <span>
                                                {f("booking.traveler")}{" "}
                                                {traveler.travelerNumber} (
                                                {t(
                                                    `${String(
                                                        traveler.travelerType
                                                    ).toLocaleLowerCase()}`
                                                )}
                                                )
                                            </span>
                                        </div>

                                        <Select
                                            onValueChange={(value) =>
                                                handleSelect(
                                                    "outbound",
                                                    traveler,
                                                    value
                                                )
                                            }
                                            value={
                                                selectedBaggage.outbound.find(
                                                    (x) =>
                                                        x.passengerId ===
                                                        traveler.travelerNumber
                                                )?.label || "No baggage"
                                            }
                                        >
                                            <SelectTrigger
                                                className="w-[200px]"
                                                dir={direction}
                                            >
                                                <SelectValue placeholder="Select baggage" />
                                            </SelectTrigger>
                                            <SelectContent dir={direction}>
                                                {outboundOptions.map(
                                                    (opt, i) => (
                                                        <SelectItem
                                                            key={i}
                                                            value={opt.label}
                                                        >
                                                            {opt.label ===
                                                            "No baggage"
                                                                ? f(
                                                                      "booking.no_baggage"
                                                                  )
                                                                : formatBaggage(
                                                                      opt.label
                                                                  )}{" "}
                                                            ( +
                                                            {formatPrice(
                                                                opt.price
                                                            )}
                                                            )
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ================= INBOUND SECTION ================= */}
                    {baggageData?.inbound && baggageData.inbound.length > 0 && (
                        <section>
                            <h3 className="font-semibold mb-3 text-lg text-primary-700 dark:text-primary-300">
                                {f("booking.inbound_baggage")}
                            </h3>
                            <div className="space-y-3">
                                {travelers.map((traveler) => (
                                    <div
                                        key={`inbound-${traveler.travelerNumber}`}
                                        className="flex items-center justify-between gap-3 p-3 border rounded-md bg-white dark:bg-gray-900"
                                    >
                                        <div className="flex items-center gap-2 text-sm">
                                            <Users className="w-4 h-4 text-accent-500" />
                                            <span>
                                                {f("booking.traveler")}{" "}
                                                {traveler.travelerNumber} (
                                                {t(
                                                    `${String(
                                                        traveler.travelerType
                                                    ).toLocaleLowerCase()}`
                                                )}
                                                )
                                            </span>
                                        </div>

                                        <Select
                                            onValueChange={(value) =>
                                                handleSelect(
                                                    "inbound",
                                                    traveler,
                                                    value
                                                )
                                            }
                                            value={
                                                selectedBaggage.inbound.find(
                                                    (x) =>
                                                        x.passengerId ===
                                                        traveler.travelerNumber
                                                )?.label || "No baggage"
                                            }
                                        >
                                            <SelectTrigger
                                                className="w-[200px]"
                                                dir={direction}
                                            >
                                                <SelectValue placeholder="Select baggage" />
                                            </SelectTrigger>
                                            <SelectContent dir={direction}>
                                                {inboundOptions.map(
                                                    (opt, i) => (
                                                        <SelectItem
                                                            key={i}
                                                            value={opt.label}
                                                        >
                                                            {opt.label ===
                                                            "No baggage"
                                                                ? f(
                                                                      "booking.no_baggage"
                                                                  )
                                                                : formatBaggage(
                                                                      opt.label
                                                                  )}{" "}
                                                            ( +
                                                            {formatPrice(
                                                                opt.price
                                                            )}
                                                            )
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* ================= SAVE BUTTON ================= */}
                <div className="flex justify-end pt-4 border-t">
                    <Button
                        onClick={handleSave}
                        className="bg-accent-100 text-accent-600 hover:bg-accent-200 cursor-pointer font-semibold"
                    >
                        {totalPrice > 0 ? (
                            <>
                                <span>{f("booking.add_baggage")}</span>&nbsp;+
                                {formatPrice(totalPrice)}
                            </>
                        ) : (
                            f("booking.continue")
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// "use client";
// import React, { useState, useEffect, useMemo } from "react";
// import { Package, Luggage, Check, Users } from "lucide-react";
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//     Select,
//     SelectTrigger,
//     SelectContent,
//     SelectItem,
//     SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import useBookingStore from "@/app/_store/bookingStore";
// import { useCurrency } from "@/app/_context/CurrencyContext";
// import { useTranslations } from "use-intl";
// import useCheckLocal from "@/app/_hooks/useCheckLocal";

// export default function BaggageDialog({ trigger }) {
//     const f = useTranslations("Flight");
//     const t = useTranslations("Traveler");
//     const { formatPrice } = useCurrency();
//     const { travelers, baggageData, addOns, setBaggageData, updateBaggage } =
//         useBookingStore();

//     const { isRTL } = useCheckLocal();
//     const condition = isRTL ? "rtl" : "ltr";

//     useEffect(() => {
//         setBaggageData({
//             outbound: [
//                 "1,No baggage,0,Outbound,true",
//                 "2,25 Kg 1 Piece,30,Outbound,true",
//                 "3,40 Kg 2 Pieces,120,Outbound,true",
//             ],
//             inbound: [
//                 "1,No baggage,0,Inbound,true",
//                 "2,20 Kg 1 Piece,25,Inbound,true",
//                 "3,30 Kg 2 Pieces,60,Inbound,true",
//             ],
//         });
//     }, [setBaggageData]);

//     const [open, setOpen] = useState(false);
//     const [selectedBaggage, setSelectedBaggage] = useState({
//         outbound: [],
//         inbound: [],
//     });

//     // ✅ عند فتح الديالوج، استرجع آخر القيم المحفوظة
//     useEffect(() => {
//         if (open) {
//             setSelectedBaggage(
//                 addOns.selectedBaggage || { outbound: [], inbound: [] }
//             );
//         }
//     }, [open, addOns.selectedBaggage]);

//     // ✅ خيارات افتراضية (fallback في حالة عدم وجود بيانات)
//     const defaultOptions = [
//         { label: "No baggage", price: 0 },
//         { label: "30 Kg 1 Piece", price: 35 },
//         { label: "40 Kg 2 Pieces", price: 120 },
//     ];

//     // ✅ الحصول على الخيارات الفعلية من البيانات القادمة
//     const outboundOptions = useMemo(() => {
//         if (!baggageData?.outbound) return defaultOptions;
//         try {
//             return baggageData.outbound.map((item) => {
//                 const [, label, price] = item.split(",");
//                 return { label, price: parseFloat(price) };
//             });
//         } catch {
//             return defaultOptions;
//         }
//     }, [baggageData?.outbound]);

//     const inboundOptions = useMemo(() => {
//         if (!baggageData?.inbound) return [];
//         try {
//             return baggageData.inbound.map((item) => {
//                 const [, label, price] = item.split(",");
//                 return { label, price: parseFloat(price) };
//             });
//         } catch {
//             return [];
//         }
//     }, [baggageData?.inbound]);

//     const totalPrice = useMemo(() => {
//         const calcTotal = (items) =>
//             items?.reduce((sum, x) => sum + (Number(x?.price) || 0), 0) || 0;

//         const outboundTotal = calcTotal(selectedBaggage.outbound);
//         const inboundTotal = calcTotal(selectedBaggage.inbound);

//         return outboundTotal + inboundTotal;
//     }, [selectedBaggage.outbound, selectedBaggage.inbound]);

//     const handleSelect = (type, passenger, value) => {
//         const options = type === "outbound" ? outboundOptions : inboundOptions;
//         const selectedOption = options.find((opt) => opt.label === value) || {
//             label: "No baggage",
//             price: 0,
//         };

//         setSelectedBaggage((prev) => {
//             const updated = [...(prev[type] || [])];
//             const existingIndex = updated.findIndex(
//                 (x) => x.passengerId === passenger.travelerNumber
//             );

//             if (existingIndex > -1) {
//                 updated[existingIndex] = {
//                     ...updated[existingIndex],
//                     ...selectedOption,
//                 };
//             } else {
//                 updated.push({
//                     passengerId: passenger.travelerNumber,
//                     ...selectedOption,
//                 });
//             }

//             const cleaned = updated.filter(
//                 (x) => x.label !== "No baggage" || x.price > 0
//             );

//             return { ...prev, [type]: cleaned };
//         });
//     };

//     const handleSave = () => {
//         updateBaggage(selectedBaggage, totalPrice);
//         setOpen(false);
//     };

//     // if (!baggageData?.outbound && !baggageData?.inbound) return null;

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger asChild>
//                 {trigger || (
//                     <Button
//                         variant="outline"
//                         className="w-full justify-between h-14 px-5 cursor-pointer"
//                     >
//                         <span className="flex items-center gap-3">
//                             <div className="bg-accent-100 dark:bg-accent-900/30 p-2 rounded-lg">
//                                 <Luggage className="size-5 text-accent-600" />
//                             </div>
//                             <span>{f("booking.extra_baggage")}</span>
//                         </span>
//                         {totalPrice > 0 && (
//                             <span className="text-accent-600">
//                                 +{formatPrice(totalPrice)}
//                             </span>
//                         )}
//                     </Button>
//                 )}
//             </DialogTrigger>

//             <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto rounded-lg">
//                 <DialogHeader>
//                     <DialogTitle className="flex items-center gap-2">
//                         <Package className="w-5 h-5" />
//                         {f("booking.baggage_information")}
//                     </DialogTitle>
//                 </DialogHeader>

//                 <div className="space-y-8 py-4">
//                     {/* ================= OUTBOUND SECTION ================= */}
//                     {baggageData?.outbound && (
//                         <section>
//                             <h3 className="font-semibold mb-3 text-lg text-primary-700 dark:text-primary-300">
//                                 {f("booking.outbound_baggage")}
//                             </h3>
//                             <div className="space-y-3">
//                                 {travelers.map((traveler) => (
//                                     <div
//                                         key={`outbound-${traveler.travelerNumber}`}
//                                         className="flex items-center justify-between gap-3 p-3 border rounded-md bg-white dark:bg-gray-900"
//                                     >
//                                         <div className="flex items-center gap-2 text-sm">
//                                             <Users className="w-4 h-4 text-accent-500" />
//                                             <span>
//                                                 {f("booking.traveler")}{" "}
//                                                 {traveler.travelerNumber} (
//                                                 {t(
//                                                     `${String(
//                                                         traveler.travelerType
//                                                     ).toLocaleLowerCase()}`
//                                                 )}
//                                                 )
//                                             </span>
//                                         </div>

//                                         <Select
//                                             onValueChange={(value) =>
//                                                 handleSelect(
//                                                     "outbound",
//                                                     traveler,
//                                                     value
//                                                 )
//                                             }
//                                             value={
//                                                 selectedBaggage.outbound.find(
//                                                     (x) =>
//                                                         x.passengerId ===
//                                                         traveler.travelerNumber
//                                                 )?.label || "No baggage"
//                                             }
//                                         >
//                                             <SelectTrigger
//                                                 className="w-[200px]"
//                                                 dir={condition}
//                                             >
//                                                 <SelectValue placeholder="Select baggage" />
//                                             </SelectTrigger>
//                                             <SelectContent dir={condition}>
//                                                 {outboundOptions.map(
//                                                     (opt, i) => (
//                                                         <SelectItem
//                                                             key={i}
//                                                             value={opt.label}
//                                                         >
//                                                             {opt.label} (+
//                                                             {formatPrice(
//                                                                 opt.price,
//                                                                 undefined,
//                                                                 12
//                                                             )}
//                                                             )
//                                                         </SelectItem>
//                                                     )
//                                                 )}
//                                             </SelectContent>
//                                         </Select>
//                                     </div>
//                                 ))}
//                             </div>
//                         </section>
//                     )}

//                     {/* ================= INBOUND SECTION ================= */}
//                     {baggageData?.inbound && baggageData.inbound.length > 0 && (
//                         <section>
//                             <h3 className="font-semibold mb-3 text-lg text-primary-700 dark:text-primary-300">
//                                 {f("booking.inbound_baggage")}
//                             </h3>
//                             <div className="space-y-3">
//                                 {travelers.map((traveler) => (
//                                     <div
//                                         key={`inbound-${traveler.travelerNumber}`}
//                                         className="flex items-center justify-between gap-3 p-3 border rounded-md bg-white dark:bg-gray-900"
//                                     >
//                                         <div className="flex items-center gap-2 text-sm">
//                                             <Users className="w-4 h-4 text-accent-500" />
//                                             <span>
//                                                 {f("booking.traveler")}{" "}
//                                                 {traveler.travelerNumber} (
//                                                 {t(
//                                                     `${String(
//                                                         traveler.travelerType
//                                                     ).toLocaleLowerCase()}`
//                                                 )}
//                                                 )
//                                             </span>
//                                         </div>

//                                         <Select
//                                             onValueChange={(value) =>
//                                                 handleSelect(
//                                                     "inbound",
//                                                     traveler,
//                                                     value
//                                                 )
//                                             }
//                                             value={
//                                                 selectedBaggage.inbound.find(
//                                                     (x) =>
//                                                         x.passengerId ===
//                                                         traveler.travelerNumber
//                                                 )?.label || "No baggage"
//                                             }
//                                         >
//                                             <SelectTrigger
//                                                 className="w-[200px] "
//                                                 dir={condition}
//                                             >
//                                                 <SelectValue placeholder="Select baggage" />
//                                             </SelectTrigger>
//                                             <SelectContent dir={condition}>
//                                                 {inboundOptions.map(
//                                                     (opt, i) => (
//                                                         <SelectItem
//                                                             key={i}
//                                                             value={opt.label}
//                                                         >
//                                                             {opt.label} (+
//                                                             {formatPrice(
//                                                                 opt.price,
//                                                                 undefined,
//                                                                 12
//                                                             )}
//                                                             )
//                                                         </SelectItem>
//                                                     )
//                                                 )}
//                                             </SelectContent>
//                                         </Select>
//                                     </div>
//                                 ))}
//                             </div>
//                         </section>
//                     )}
//                 </div>

//                 {/* ================= SAVE BUTTON ================= */}
//                 <div className="flex justify-end pt-4 border-t">
//                     <Button
//                         onClick={handleSave}
//                         className="bg-accent-100 text-accent-600 hover:bg-accent-200 cursor-pointer font-semibold"
//                     >
//                         {totalPrice > 0 ? (
//                             <>
//                                 <span>{f("booking.add_baggage")}</span>&nbsp;+
//                                 {formatPrice(totalPrice)}
//                             </>
//                         ) : (
//                             f("booking.continue")
//                         )}
//                     </Button>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     );
// }

// import React, { useState, useEffect } from "react";
// import { Package, Luggage, Backpack, Check } from "lucide-react";
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { useCurrency } from "@/app/_context/CurrencyContext";
// import useBookingStore from "@/app/_store/bookingStore";
// import { useFormatBaggage } from "@/app/_hooks/useFormatBaggage";
// import { useTranslations } from "use-intl";

// const extraBaggageOptions = [
//     { weight: "5 Kilograms", price: 50, currency: "AED" },
//     { weight: "10 Kilograms", price: 95, currency: "AED" },
//     { weight: "15 Kilograms", price: 140, currency: "AED" },
//     { weight: "20 Kilograms", price: 180, currency: "AED" },
//     { weight: "25 Kilograms", price: 220, currency: "AED" },
//     { weight: "30 Kilograms", price: 260, currency: "AED" },
// ];

// const one = [
//     "1,30 Kg 1 Piece,35,OutwardLuggageOptions,true",
//     "2,30 Kg Total in 2 Piece,45,OutwardLuggageOptions,true",
//     "3,40 Kg Total in 2 Piece,120,OutwardLuggageOptions,true",
// ];

// const two = [
//     "1,30 Kg 1 Piece,35,OutwardLuggageOptions,true",
//     "2,30 Kg Total in 2 Piece,45,OutwardLuggageOptions,true",
//     "3,40 Kg Total in 2 Piece,120,OutwardLuggageOptions,true",
// ];

// export default function BaggageDialog({
//     cabinLuggage,
//     includedBaggage,
//     trigger,
// }) {
//     const [open, setOpen] = useState(false);
//     const { formatPrice } = useCurrency();
//     const { formatBaggage } = useFormatBaggage();
//     const f = useTranslations("Flight");

//     // Get baggage selection from store
//     const { baggageData } = useBookingStore();
//     const selectedBaggage = useBookingStore(
//         (state) => state.addOns.selectedBaggage
//     );
//     const updateBaggage = useBookingStore((state) => state.updateBaggage);

//     const [selectedExtra, setSelectedExtra] = useState(selectedBaggage);

//     // Sync with store when dialog opens
//     useEffect(() => {
//         if (open) {
//             setSelectedExtra(selectedBaggage);
//         }
//     }, [open, selectedBaggage]);

//     const selectExtra = (index) => {
//         // Toggle selection - if clicking same option, deselect it
//         const newSelection = selectedExtra === index ? null : index;
//         setSelectedExtra(newSelection);
//     };

//     const totalExtraCost =
//         selectedExtra !== null ? extraBaggageOptions[selectedExtra].price : 0;

//     const handleSave = () => {
//         // Save baggage selections to store
//         updateBaggage(selectedExtra, totalExtraCost);
//         setOpen(false);
//     };

//     if (!baggageData.outward || !baggageData.outward) return null;

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger asChild>
//                 {trigger || (
//                     <Button
//                         variant="outline"
//                         className="w-full justify-between h-14 px-5 cursor-pointer"
//                     >
//                         <span className="flex items-center gap-3">
//                             <div className="bg-accent-100 dark:bg-accent-900/30 p-2 rounded-lg">
//                                 <Luggage className="size-5 text-accent-600" />
//                             </div>
//                             <span>
//                                 {selectedBaggage !== null
//                                     ? formatBaggage(
//                                           extraBaggageOptions[selectedBaggage]
//                                               .weight
//                                       )
//                                     : f("booking.extra_baggage")}
//                             </span>
//                         </span>
//                         {selectedBaggage !== null && (
//                             <span className="text-accent-600">
//                                 +
//                                 {formatPrice(
//                                     extraBaggageOptions[selectedBaggage].price
//                                 )}
//                             </span>
//                         )}
//                     </Button>
//                 )}
//             </DialogTrigger>
//             <DialogContent className="max-w-2xl max-h-[100vh] sm:max-h-[90vh] overflow-y-auto rounded-none sm:rounded">
//                 <DialogHeader>
//                     <DialogTitle className="flex items-center gap-2  rtl:justify-start">
//                         <Package className="w-5 h-5" />
//                         {f("booking.baggage_information")}
//                     </DialogTitle>
//                     <DialogDescription className="rtl:text-right">
//                         {f("booking.baggage_subtitle")}
//                     </DialogDescription>
//                 </DialogHeader>

//                 <div className="space-y-6 py-4">
//                     {/* Included Baggage */}
//                     <div>
//                         <h4 className="mb-4 rtl:text-right">
//                             {f("booking.included_baggage")}
//                         </h4>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             {cabinLuggage && (
//                                 <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
//                                     <div className="bg-green-100 dark:bg-green-900 p-2 rounded shrink-0">
//                                         <Backpack className="w-5 h-5 text-green-600 dark:text-green-400" />
//                                     </div>
//                                     <div className="flex-1">
//                                         <div className="text-sm mb-1 flex items-center gap-2">
//                                             {f("booking.cabin_baggage")}
//                                             <Check className="w-4 h-4 text-green-600" />
//                                         </div>
//                                         <div className="text-xs text-muted-foreground">
//                                             {formatBaggage(cabinLuggage)}
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                             {includedBaggage && includedBaggage.length > 0 && (
//                                 <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
//                                     <div className="bg-green-100 dark:bg-green-900 p-2 rounded shrink-0">
//                                         <Luggage className="w-5 h-5 text-green-600 dark:text-green-400" />
//                                     </div>
//                                     <div className="flex-1">
//                                         <div className="text-sm mb-1 flex items-center gap-2">
//                                             {f("booking.checked_baggage")}
//                                             <Check className="w-4 h-4 text-green-600" />
//                                         </div>
//                                         <div className="text-xs text-muted-foreground">
//                                             {formatBaggage(includedBaggage)}
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Extra Baggage Options */}
//                     <div>
//                         <div className="flex items-center justify-between mb-4">
//                             <h4 className="rtl:text-right">
//                                 {f("booking.extra_baggage")}
//                             </h4>
//                             {totalExtraCost > 0 && (
//                                 <Badge
//                                     variant="default"
//                                     className="bg-accent-100 text-accent-500"
//                                 >
//                                     +{formatPrice(totalExtraCost)}
//                                 </Badge>
//                             )}
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                             {extraBaggageOptions.map((option, index) => {
//                                 const isSelected = selectedExtra === index;
//                                 return (
//                                     <button
//                                         key={index}
//                                         onClick={() => selectExtra(index)}
//                                         className={`
//                       flex items-center justify-between p-4 rounded-lg border-2 transition-all text-left cursor-pointer
//                       ${
//                           isSelected
//                               ? "border-accent-500 bg-blue-50 dark:bg-primary-900"
//                               : "border-border bg-white dark:bg-gray-800 hover:border-blue-300"
//                       }
//                     `}
//                                     >
//                                         <div className="flex items-center gap-3 ">
//                                             <div
//                                                 className={`
//                         w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0
//                         ${
//                             isSelected
//                                 ? "border-accent-500 bg-accent-500"
//                                 : "border-gray-300 dark:border-gray-600"
//                         }
//                       `}
//                                             >
//                                                 {isSelected && (
//                                                     <Check className="w-3 h-3 text-white" />
//                                                 )}
//                                             </div>
//                                             <div className="rtl:text-right">
//                                                 <div className="text-sm">
//                                                     {formatBaggage(
//                                                         option.weight
//                                                     )}
//                                                 </div>
//                                                 <div className="text-xs text-muted-foreground">
//                                                     {f(
//                                                         "booking.extra_baggage_summary"
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="text-sm">
//                                             +{formatPrice(option.price)}
//                                         </div>
//                                     </button>
//                                 );
//                             })}
//                         </div>
//                     </div>

//                     {/* Important Info */}
//                     <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-md border border-amber-200 dark:border-amber-800">
//                         <h5 className="text-amber-900 dark:text-amber-100 mb-2 text-sm rtl:text-right">
//                             {f("booking.important_information")}
//                         </h5>
//                         <ul className="text-xs text-amber-800 dark:text-amber-200 space-y-1 list-disc list-inside rtl:list-inside rtl:text-right">
//                             <li>{f("booking.important_information_one")}</li>
//                             <li>{f("booking.important_information_two")}</li>
//                             <li>{f("booking.important_information_three")}</li>
//                             <li>{f("booking.important_information_four")}</li>
//                         </ul>
//                     </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex gap-3 justify-end pt-4 border-t rtl:flex-row-reverse rtl:justify-start">
//                     <Button variant="outline" onClick={() => setOpen(false)}>
//                         {f("booking.cancel")}
//                     </Button>
//                     <Button
//                         onClick={handleSave}
//                         className="bg-accent-100 cursor-pointer text-accent-500 hover:bg-accent-100"
//                     >
//                         {totalExtraCost > 0 ? (
//                             <>
//                                 <span>{f("booking.add_baggage")}</span>
//                                 {formatPrice(totalExtraCost)}
//                             </>
//                         ) : (
//                             f("booking.continue")
//                         )}
//                     </Button>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     );
// }
