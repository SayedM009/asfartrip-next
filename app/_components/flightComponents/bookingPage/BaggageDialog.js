"use client";
import { useState, useEffect, useMemo } from "react";
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
import { useTranslations } from "use-intl";
import { useFormatBaggage } from "@/app/_hooks/useFormatBaggage";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import useBookingStore from "@/app/_store/bookingStore";
import { useCurrencyStore } from "@/app/_store/useCurrencyStore";

export default function BaggageDialog({ trigger }) {
    const f = useTranslations("Flight");
    const t = useTranslations("Traveler");
    const { formatBaggage } = useFormatBaggage();
    const { formatPrice } = useCurrencyStore();
    const { travelers, baggageData, addOns, updateBaggage } = useBookingStore();
    const { isRTL } = useCheckLocal();
    const direction = isRTL ? "rtl" : "ltr";

    const [open, setOpen] = useState(false);
    const [selectedBaggage, setSelectedBaggage] = useState({
        outward: [],
        return: [],
    });

    useEffect(() => {
        if (addOns?.selectedBaggage) {
            setSelectedBaggage(addOns.selectedBaggage);
        }
    }, [addOns.selectedBaggage]);

    const outwardOptions = useMemo(() => {
        const raw = baggageData?.outward;
        if (!Array.isArray(raw))
            return [{ label: f("booking.no_baggage"), price: 0 }];

        const formatted = raw.map((item) => {
            const [, label, price] = item.split(",");
            return { label, price: parseFloat(price) || 0 };
        });

        return [{ label: f("booking.no_baggage"), price: 0 }, ...formatted];
    }, [baggageData?.outward]);

    const returnOptions = useMemo(() => {
        const raw = baggageData?.return;
        if (!Array.isArray(raw))
            return [{ label: f("booking.no_baggage"), price: 0 }];

        const formatted = raw.map((item) => {
            const [, label, price] = item.split(",");
            return { label, price: parseFloat(price) || 0 };
        });

        return [{ label: f("booking.no_baggage"), price: 0 }, ...formatted];
    }, [baggageData?.return]);

    const totalPrice = useMemo(() => {
        const calcTotal = (items) =>
            items?.reduce((sum, x) => sum + (Number(x?.price) || 0), 0) || 0;
        return (
            calcTotal(selectedBaggage.outward) +
            calcTotal(selectedBaggage.return)
        );
    }, [selectedBaggage.outward, selectedBaggage.return]);

    const handleSelect = (type, passenger, value) => {
        const options = type === "outward" ? outwardOptions : returnOptions;

        setSelectedBaggage((prev) => {
            const updated = [...(prev[type] || [])];
            const existingIndex = updated.findIndex(
                (x) => x.passengerId === passenger.travelerNumber
            );

            if (value === "No baggage") {
                if (existingIndex > -1) updated.splice(existingIndex, 1);
                return { ...prev, [type]: updated };
            }

            const selectedOption = options.find((opt) => opt.label === value);
            if (selectedOption) {
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
            }

            return { ...prev, [type]: updated };
        });
    };

    const handleSave = () => {
        updateBaggage(selectedBaggage, totalPrice);
        setOpen(false);
    };

    if (!baggageData?.outward?.length && !baggageData?.return?.length)
        return null;

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

            <DialogContent className="sm:max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        {f("booking.baggage_information")}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-8 py-4">
                    {/* ================= OUTWARD SECTION ================= */}
                    {Array.isArray(baggageData?.outward) && (
                        <section>
                            <h3 className="font-semibold mb-3 text-lg text-primary-700 dark:text-primary-300">
                                {f("booking.outbound_baggage")}
                            </h3>
                            <div className="space-y-3">
                                {travelers.map((traveler) => (
                                    <div
                                        key={`outward-${traveler.travelerNumber}`}
                                        className="flex items-center justify-between gap-3 p-3 border rounded-md bg-white dark:bg-gray-900"
                                    >
                                        <div className="flex items-center gap-2 text-sm">
                                            <Users className="w-4 h-4 text-accent-500" />
                                            <div>
                                                <span>
                                                    {f("booking.traveler")}{" "}
                                                    {traveler.travelerNumber}
                                                </span>
                                                <p className="text-xs">
                                                    {t(
                                                        `${String(
                                                            traveler.travelerType
                                                        ).toLowerCase()}`
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <Select
                                            onValueChange={(value) =>
                                                handleSelect(
                                                    "outward",
                                                    traveler,
                                                    value
                                                )
                                            }
                                            value={
                                                selectedBaggage.outward.find(
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
                                                {outwardOptions.map(
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

                    {/* ================= RETURN SECTION ================= */}
                    {Array.isArray(baggageData?.return) &&
                        baggageData.return.length > 0 && (
                            <section>
                                <h3 className="font-semibold mb-3 text-lg text-primary-700 dark:text-primary-300">
                                    {f("booking.inbound_baggage")}
                                </h3>
                                <div className="space-y-3">
                                    {travelers.map((traveler) => (
                                        <div
                                            key={`return-${traveler.travelerNumber}`}
                                            className="flex items-center justify-between gap-3 p-3 border rounded-md bg-white dark:bg-gray-900"
                                        >
                                            <div className="flex items-center gap-2 text-sm">
                                                <Users className="w-4 h-4 text-accent-500" />
                                                <div>
                                                    <span>
                                                        {f("booking.traveler")}{" "}
                                                        {
                                                            traveler.travelerNumber
                                                        }
                                                    </span>
                                                    <p className="text-xs">
                                                        {t(
                                                            `${String(
                                                                traveler.travelerType
                                                            ).toLowerCase()}`
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <Select
                                                onValueChange={(value) =>
                                                    handleSelect(
                                                        "return",
                                                        traveler,
                                                        value
                                                    )
                                                }
                                                value={
                                                    selectedBaggage.return.find(
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
                                                    {returnOptions.map(
                                                        (opt, i) => (
                                                            <SelectItem
                                                                key={i}
                                                                value={
                                                                    opt.label
                                                                }
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
