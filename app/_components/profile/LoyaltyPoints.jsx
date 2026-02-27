"use client";

import { useCurrencyStore } from "@/app/_modules/currency/store/useCurrencyStore";
import useLoyaltyStore from "@/app/_modules/loyalty/store/loyaltyStore";
import { StarIcon, Trophy } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

function LoyaltyPoints() {
    const { balance, tier, config } = useLoyaltyStore();
    const { formatPrice } = useCurrencyStore();
    const { theme } = useTheme();
    const t = useTranslations("Loyalty");
    return (
        <section className="shadow-lg p-4  border  rounded-xl flex flex-col  hover:cursor-pointer user-select-none hover:shadow-xl transition-all col-span-1">
            <div
                className="relative inline-flex items-center justify-center 
             w-12 h-12 rounded-xl
             bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
             shadow-lg shadow-purple-500/30"
            >
                <div
                    className="absolute inset-0 rounded-xl 
               bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
               blur-md opacity-60
               -z-10"
                />

                <StarIcon className="w-7 h-7 text-white" />
            </div>

            <h2 className="mt-4 font-bold text-xl flex items-center gap-2 mb-2">
                <span>{t("points_balance")}</span>
                <span>{balance}</span>≈
                <span>
                    {formatPrice(
                        tier.points_balance * config?.redemption_rate,
                        theme === "dark" ? "white" : "black",
                    )}
                </span>
            </h2>
            <p className="text-sm gray-500 dark:text-gray-400">
                {t("points_value")}
            </p>
        </section>
    );
}

export default LoyaltyPoints;
