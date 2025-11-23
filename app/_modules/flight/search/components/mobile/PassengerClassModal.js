"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Users, Plus, Minus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { useTranslations } from "next-intl";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import {
    applyPassengerRules,
    canAddPassenger,
    canRemovePassenger,
} from "../../logic/applyPassengerRules";

export function PassengerClassModal({
    passengers,
    travelClass,
    onPassengersChange,
    onClassChange,
    children,
}) {
    const t = useTranslations("Flight");
    const { isRTL } = useCheckLocal();

    const [isOpen, setIsOpen] = useState(false);

    // Temp state for UI
    const [tempPassengers, setTempPassengers] = useState(passengers);
    const [tempClass, setTempClass] = useState(travelClass.toLowerCase() || "economy");

    const total =
        tempPassengers.adults +
        tempPassengers.children +
        tempPassengers.infants;

    const passengerTypes = [
        { key: "adults", label: "Adults" },
        { key: "children", label: "Children" },
        { key: "infants", label: "Infants" },
    ];

    const updatePassengers = (type, increment) => {
        setTempPassengers((prev) => {
            // CRITICAL: Check BEFORE making any changes
            if (increment && !canAddPassenger(type, prev)) {
                // Prevent the action entirely
                return prev;
            }
            if (!increment && !canRemovePassenger(type, prev)) {
                return prev;
            }

            // Calculate new value
            let newValue = increment
                ? prev[type] + 1
                : Math.max(0, prev[type] - 1);

            // Create updated object with the change
            let updated = {
                ...prev,
                [type]: newValue,
            };

            // Apply passenger rules to handle edge cases
            // (like reducing adults when infants > adults)
            updated = applyPassengerRules({
                ADT: updated.adults,
                CHD: updated.children,
                INF: updated.infants,
            });

            return updated;
        });
    };

    const applyChanges = () => {
        console.log(tempPassengers)
        onPassengersChange(tempPassengers);
        sessionStorage.setItem(
            "flightPassengers",
            JSON.stringify(tempPassengers)
        );
        
        console.log(tempClass)
        onClassChange(tempClass);
        
        sessionStorage.setItem("travelClass", tempClass);

        setIsOpen(false);
    };

    const cancelChanges = () => {
        setTempPassengers(passengers);
        setTempClass(travelClass);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button
                        variant="outline"
                        className="h-12 w-full justify-start p-0"
                    >
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div className="flex flex-col items-start">
                            <span className="text-xs text-muted-foreground">
                                {t("passengers.title")}
                            </span>
                            <span className="text-sm">
                                {total}{" "}
                                {total === 1 ? "Passenger" : "Passengers"}
                            </span>
                        </div>
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-md" dir={isRTL ? "rtl" : "ltr"}>
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>{t("passengers.title")}</span>
                    </DialogTitle>
                    <DialogDescription>
                        {t("passengers.subtitle")}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* PASSENGERS */}
                    <div>
                        <Label className="text-sm mb-3 block">
                            {t("passengers.passengers")}
                        </Label>

                        <div className="space-y-4">
                            {passengerTypes.map(({ key }) => (
                                <div
                                    key={key}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex-1">
                                        <div className="font-medium">
                                            {t(`passengers.${key}`)}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {t(`passengers.${key}_description`)}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() =>
                                                updatePassengers(key, false)
                                            }
                                            disabled={
                                                !canRemovePassenger(
                                                    key,
                                                    tempPassengers
                                                )
                                            }
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>

                                        <span className="w-8 text-center font-medium">
                                            {tempPassengers[key]}
                                        </span>

                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() =>
                                                updatePassengers(key, true)
                                            }
                                            disabled={
                                                !canAddPassenger(
                                                    key,
                                                    tempPassengers
                                                )
                                            }
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* TRAVEL CLASS */}
                    <div>
                        <Label className="text-sm mb-3 block capitalize">
                            {t("passengers.travel_class")}
                        </Label>

                        <Select value={tempClass} onValueChange={setTempClass} dir={isRTL ? "rtl" : "ltr"}>
                            <SelectTrigger className="w-full capitalize">
                                <SelectValue className="capitalize" />
                            </SelectTrigger>
                            <SelectContent className="capitalize">
                                <SelectItem value="economy">
                                    {t("ticket_class.economy")}
                                </SelectItem>
                                <SelectItem value="business">
                                    {t("ticket_class.business")}
                                </SelectItem>
                                <SelectItem value="first">
                                    {t("ticket_class.first")}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button variant="outline" onClick={cancelChanges}>
                            {t("passengers.cancel")}
                        </Button>
                        <Button
                            className="bg-accent-500 text-white"
                            onClick={applyChanges}
                        >
                            {t("passengers.apply")}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
