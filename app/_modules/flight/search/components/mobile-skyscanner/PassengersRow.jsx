"use client";

import { useState } from "react";
import { Users, ChevronDown, User, Baby } from "lucide-react";
import { useTranslations } from "next-intl";
import PassengersBottomSheet from "./PassengersBottomSheet";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function PassengersRow({
    passengers,
    travelClass,
    onPassengersChange,
    onClassChange,
}) {
    const t = useTranslations("Flight.ticket_class");
    const tc = useTranslations("Calender");
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // Format class display
    const classLabels = {
        economy: t("economy") || "Economy",
        business: t("business") || "Business",
        first: t("first") || "First",
    };

    // Build passenger summary with icons
    const { adults = 1, children = 0, infants = 0 } = passengers || {};

    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <>
            <button
                type="button"
                onClick={() => setIsSheetOpen(true)}
                className="w- flex items-center justify-between  rounded-2xl text-start hover:bg-[#0D2D4D] transition-colors py-4"
                aria-label={t("passengers_and_class") || "Passengers and class"}
            >
                <div className="flex items-center gap-6">
                    {/* Adults */}
                    <div className="flex items-center gap-1.5 text-black dark:text-white">
                        {/* <User /> */}
                        <Image
                            src={
                                isDark
                                    ? "/icons/masculine-w.png"
                                    : "/icons/masculine-b.png"
                            }
                            alt="adults"
                            width={22}
                            height={22}
                        />
                        <span className="font-medium">{adults}</span>
                    </div>

                    {/* Children */}
                    <div className="flex items-center gap-1.5 text-black dark:text-white  ">
                        <Image
                            src={
                                isDark
                                    ? "/icons/masculine-w.png"
                                    : "/icons/masculine-b.png"
                            }
                            alt="children"
                            width={18}
                            height={18}
                        />
                        <span className="font-medium">{children}</span>
                    </div>

                    {/* Infants */}
                    <div className="flex items-center gap-1.5 text-black dark:text-white">
                        <Image
                            src={
                                isDark
                                    ? "/icons/child-w.png"
                                    : "/icons/child-b.png"
                            }
                            alt="infants"
                            width={17}
                            height={17}
                        />
                        <span className="font-medium">{infants}</span>
                    </div>
                </div>

                {/* Class with dropdown icon */}
                <div className="flex items-center gap-2 text-black dark:text-white">
                    <span className="text-sm">
                        {classLabels[travelClass] || classLabels.economy}
                    </span>
                    <ChevronDown className="w-4 h-4 " />
                </div>
            </button>

            {/* Passengers Bottom Sheet */}
            <PassengersBottomSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                passengers={passengers}
                travelClass={travelClass}
                onPassengersChange={onPassengersChange}
                onClassChange={onClassChange}
            />
        </>
    );
}
