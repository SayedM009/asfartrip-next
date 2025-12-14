"use client";

import { X, Plus, Minus } from "lucide-react";
import { useTranslations } from "next-intl";
import { applyPassengerRules } from "../../logic/applyPassengerRules";

/**
 * PassengersBottomSheet - Full-screen passenger & class selection
 *
 * Features:
 * - Stepper controls for adults, children, infants
 * - Cabin class selection
 * - Reuses existing applyPassengerRules logic
 */
export default function PassengersBottomSheet({
    isOpen,
    onClose,
    passengers,
    travelClass,
    onPassengersChange,
    onClassChange,
}) {
    const t = useTranslations("Flight");

    const { adults = 1, children = 0, infants = 0 } = passengers || {};

    // Apply rules when updating
    const updatePassenger = (type, increment) => {
        const mapping = {
            adults: "adults",
            children: "children",
            infants: "infants",
        };

        const apiMapping = {
            adults: "ADT",
            children: "CHD",
            infants: "INF",
        };

        const current = passengers[type];
        const newCount = increment ? current + 1 : Math.max(0, current - 1);

        let updated = { ...passengers, [type]: newCount };

        // Apply business rules
        const ruled = applyPassengerRules({
            ADT: updated.adults,
            CHD: updated.children,
            INF: updated.infants,
        });

        onPassengersChange(ruled);
    };

    const cabinClasses = [
        { id: "economy", label: t("ticket_class.economy") || "Economy" },
        { id: "business", label: t("ticket_class.business") || "Business" },
        { id: "first", label: t("ticket_class.first") || "First" },
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b ">
                <button
                    type="button"
                    onClick={onClose}
                    className="p-2 -m-2 "
                    aria-label={t("close") || "Close"}
                >
                    <X className="w-6 h-6" />
                </button>
                <h2 className="text-lg font-bold text-black dark:text-white ">
                    {t("passengers.title") || "Passengers & Class"}
                </h2>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {/* Passengers Section */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold  uppercase tracking-wide">
                        {t("passengers.passengers") || "Passengers"}
                    </h3>

                    {/* Adults */}
                    <div className="flex items-center justify-between py-3 text-black dark:text-white ">
                        <div>
                            <div className=" font-bold">
                                {t("passengers.adults") || "Adults"}
                            </div>
                            <div className="text-sm ">
                                {t("passengers.adults_description") ||
                                    "12+ years"}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => updatePassenger("adults", false)}
                                disabled={adults <= 1}
                                className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center  disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Decrease adults"
                            >
                                <Minus className="w-5 h-5" />
                            </button>
                            <span className="w-8 text-center  font-bold text-lg">
                                {adults}
                            </span>
                            <button
                                type="button"
                                onClick={() => updatePassenger("adults", true)}
                                className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center  hover:bg-[#0A2540]"
                                aria-label="Increase adults"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between py-3 text-black dark:text-white ">
                        <div>
                            <div className=" font-bold">
                                {t("passengers.children") || "Children"}
                            </div>
                            <div className="text-sm ">
                                {t("passengers.children_description") ||
                                    "2-11 years"}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() =>
                                    updatePassenger("children", false)
                                }
                                disabled={children <= 0}
                                className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center  disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Decrease children"
                            >
                                <Minus className="w-5 h-5" />
                            </button>
                            <span className="w-8 text-center  font-bold text-lg">
                                {children}
                            </span>
                            <button
                                type="button"
                                onClick={() =>
                                    updatePassenger("children", true)
                                }
                                className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center  hover:bg-[#0A2540]"
                                aria-label="Increase children"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Infants */}
                    <div className="flex items-center justify-between py-3 text-black dark:text-white ">
                        <div>
                            <div className=" font-bold">
                                {t("passengers.infants") || "Infants"}
                            </div>
                            <div className="text-sm ">
                                {t("passengers.infants_description") ||
                                    "Under 2 years"}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() =>
                                    updatePassenger("infants", false)
                                }
                                disabled={infants <= 0}
                                className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center  disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Decrease infants"
                            >
                                <Minus className="w-5 h-5" />
                            </button>
                            <span className="w-8 text-center  font-bold text-lg">
                                {infants}
                            </span>
                            <button
                                type="button"
                                onClick={() => updatePassenger("infants", true)}
                                className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center  hover:bg-[#0A2540]"
                                aria-label="Increase infants"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-200 my-6" />

                {/* Cabin Class Section */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold  text-black dark:text-white uppercase tracking-wide">
                        {t("ticket_class.cabin_class") || "Cabin Class"}
                    </h3>

                    <div className="space-y-2">
                        {cabinClasses.map((cls) => (
                            <button
                                key={cls.id}
                                type="button"
                                onClick={() => onClassChange(cls.id)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
                                    travelClass === cls.id
                                        ? "bg-[#0062E3] text-white"
                                        : "bg-[#243346]  hover:bg-[#0D2D4D] text-white"
                                }`}
                            >
                                <span className="font-medium">{cls.label}</span>
                                {travelClass === cls.id && (
                                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-[#0062E3] " />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t ">
                <button
                    type="button"
                    onClick={onClose}
                    // className="w-full h-12 bg-[#0062E3] text-white  font-bold text-base rounded-full shadow-lg transition-all"
                    className="w-full h-12 bg-accent-500 text-white  font-bold text-base rounded-full shadow-lg transition-all"
                >
                    {t("passengers.apply") || "Apply"}
                </button>
            </div>
        </div>
    );
}
