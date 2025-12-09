"use client";

import { useTranslations } from "next-intl";
import { Users, User, Baby, ChevronRight } from "lucide-react";
import { PassengerClassModal } from "../mobile/PassengerClassModal";
import { normalizeClassName } from "../../utils/formatters";
import { UserGroupIcon } from "@heroicons/react/24/outline";

/**
 * WegoPassengerSelector - Passengers and class summary
 *
 * Wego-style compact display with passenger icons.
 * Reuses existing PassengerClassModal for selection.
 */
export default function WegoPassengerSelector({
    passengers,
    travelClass,
    onPassengersChange,
    onClassChange,
}) {
    const t = useTranslations("Flight");

    const totalPassengers =
        passengers.adults + passengers.children + passengers.infants;

    return (
        <div className="py-1">
            <PassengerClassModal
                passengers={passengers}
                travelClass={travelClass}
                onPassengersChange={onPassengersChange}
                onClassChange={onClassChange}
            >
                <div className=" cursor-pointer">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-10  flex items-center justify-center">
                            <UserGroupIcon className="size-6 dark:text-white" />
                        </div>

                        <div className="flex-1">
                            <p className="text-xs text-muted-foreground mb-1 text-left rtl:text-right">
                                {t("passengers.title")}
                            </p>
                            <div className="flex items-center gap-2 ">
                                {/* Passenger counts */}
                                <div className="flex items-center gap-1 text-sm ">
                                    <span className="flex items-center gap-1 text-black dark:text-white font-bold">
                                        <span className="font-bold">
                                            {passengers.adults}
                                        </span>
                                        {passengers.adults > 1
                                            ? t("passengers.adults")
                                            : t("passengers.adult")}
                                    </span>
                                    {passengers.children > 0 && (
                                        <span className="flex items-center gap-1 text-black dark:text-white font-bold">
                                            <span className="font-bold">
                                                {passengers.children}
                                            </span>
                                            {passengers.children > 1
                                                ? t("passengers.children")
                                                : t("passengers.child")}
                                        </span>
                                    )}
                                    {passengers.infants > 0 && (
                                        <span className="flex items-center gap-1 text-black dark:text-white font-bold">
                                            <span className="font-bold">
                                                {passengers.infants}
                                            </span>
                                            {passengers.infants > 1
                                                ? t("passengers.infants")
                                                : t("passengers.infant")}
                                        </span>
                                    )}
                                </div>

                                {/* Divider */}
                                <span className="text-muted-foreground">•</span>

                                {/* Cabin Class */}
                                <span className="text-sm font-bold text-black dark:text-white capitalize">
                                    {t(
                                        `ticket_class.${normalizeClassName(
                                            travelClass
                                        )}`
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </PassengerClassModal>
        </div>
    );
}
