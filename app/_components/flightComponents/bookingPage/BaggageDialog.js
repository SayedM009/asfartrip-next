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
