import React, { useState } from "react";

import { Package, Plus, Minus, Check } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const extraBaggageOptions = [
    { weight: "5 kg", price: 50, currency: "AED" },
    { weight: "10 kg", price: 95, currency: "AED" },
    { weight: "15 kg", price: 140, currency: "AED" },
    { weight: "20 kg", price: 180, currency: "AED" },
    { weight: "25 kg", price: 220, currency: "AED" },
    { weight: "30 kg", price: 260, currency: "AED" },
];

export default function BaggageDialog({
    cabinLuggage,
    includedBaggage,
    trigger,
    selectedBaggage,
    onBaggageChange,
}) {
    const [open, setOpen] = useState(false);
    const [selectedExtra, setSelectedExtra] = useState(selectedBaggage ?? null);

    const selectExtra = (index) => {
        // Toggle selection - if clicking same option, deselect it
        const newSelection = selectedExtra === index ? null : index;
        setSelectedExtra(newSelection);
    };

    const totalExtraCost =
        selectedExtra !== null ? extraBaggageOptions[selectedExtra].price : 0;

    const handleSave = () => {
        // Save baggage selections
        onBaggageChange?.(selectedExtra, totalExtraCost);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button
                        variant="outline"
                        className="w-full justify-between h-14 px-5"
                    >
                        <span className="flex items-center gap-3">
                            <Package className="size-5 text-accent-600" />
                            <span>
                                {selectedExtra !== null
                                    ? extraBaggageOptions[selectedExtra].weight
                                    : "Add Extra Baggage"}
                            </span>
                        </span>
                        {selectedExtra !== null && (
                            <span className="text-blue-600">
                                +{totalExtraCost} AED
                            </span>
                        )}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[100vh] sm:max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 rtl:flex-row-reverse rtl:justify-end">
                        <Package className="w-5 h-5" />
                        Baggage Information
                    </DialogTitle>
                    <DialogDescription className="rtl:text-right">
                        View included baggage and add extra baggage to your
                        booking
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Included Baggage */}
                    <div>
                        <h4 className="mb-4 rtl:text-right">
                            Included Baggage
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {cabinLuggage && (
                                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded shrink-0">
                                        <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm mb-1 flex items-center gap-2">
                                            Cabin Baggage
                                            <Check className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {cabinLuggage}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {includedBaggage && includedBaggage.length > 0 && (
                                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded shrink-0">
                                        <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm mb-1 flex items-center gap-2">
                                            Check-in Baggage
                                            <Check className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {includedBaggage.join(", ")}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Extra Baggage Options */}
                    <div>
                        <div className="flex items-center justify-between mb-4 rtl:flex-row-reverse">
                            <h4 className="rtl:text-right">
                                Add Extra Baggage
                            </h4>
                            {totalExtraCost > 0 && (
                                <Badge
                                    variant="default"
                                    className="bg-blue-600"
                                >
                                    +{totalExtraCost} AED
                                </Badge>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {extraBaggageOptions.map((option, index) => {
                                const isSelected = selectedExtra === index;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => selectExtra(index)}
                                        className={`
                      flex items-center justify-between p-4 rounded-lg border-2 transition-all text-left
                      ${
                          isSelected
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                              : "border-border bg-white dark:bg-gray-800 hover:border-blue-300"
                      }
                    `}
                                    >
                                        <div className="flex items-center gap-3 rtl:flex-row-reverse rtl:justify-end">
                                            <div
                                                className={`
                        w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0
                        ${
                            isSelected
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300 dark:border-gray-600"
                        }
                      `}
                                            >
                                                {isSelected && (
                                                    <Check className="w-3 h-3 text-white" />
                                                )}
                                            </div>
                                            <div className="rtl:text-right">
                                                <div className="text-sm">
                                                    {option.weight}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Extra baggage
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-sm">
                                            +{option.price} {option.currency}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Important Info */}
                    <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-md border border-amber-200 dark:border-amber-800">
                        <h5 className="text-amber-900 dark:text-amber-100 mb-2 text-sm rtl:text-right">
                            Important Information
                        </h5>
                        <ul className="text-xs text-amber-800 dark:text-amber-200 space-y-1 list-disc list-inside rtl:list-inside rtl:text-right">
                            <li>Extra baggage must be added before check-in</li>
                            <li>Prices are per person, per segment</li>
                            <li>
                                Oversized baggage may incur additional fees at
                                the airport
                            </li>
                            <li>
                                Baggage allowance varies by airline and route
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-4 border-t">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {totalExtraCost > 0
                            ? `Add Baggage (+${totalExtraCost} AED)`
                            : "Continue"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
