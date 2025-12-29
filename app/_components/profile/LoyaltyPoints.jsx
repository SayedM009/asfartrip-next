"use client";

import { useCurrencyStore } from "@/app/_modules/currency/store/useCurrencyStore";
import useLoyaltyStore from "@/app/_modules/loyalty/store/loyaltyStore";
import { StarIcon, Trophy } from "lucide-react";
import { useTheme } from "next-themes";

function LoyaltyPoints() {
    const { balance, tier, config } = useLoyaltyStore();
    const { formatPrice } = useCurrencyStore();
    const { theme } = useTheme();
    console.log(config);
    return (
        <section className="shadow-lg p-4  border  rounded-xl flex flex-col  hover:cursor-pointer user-select-none hover:shadow-xl transition-all col-span-1">
            <StarIcon className="size-6 " />
            <h3 className="mt-4 font-bold text-xl flex items-center gap-2">
                <span>Points</span>
                <span>{balance}</span>≈
                <span>
                    {formatPrice(
                        tier.points_balance * config.redemption_rate,
                        theme === "dark" ? "white" : "black"
                    )}
                </span>
            </h3>
            <p className="text-sm gray-500 dark:text-gray-400">
                You will receive Trip Coins for 1 booking once your trip is
                completed.
            </p>
        </section>
    );
}

export function LoyaltyTier() {
    const {
        tier: { points_to_next_tier, tier_name },
    } = useLoyaltyStore();

    return (
        <section className="shadow-lg p-4  border  rounded-xl flex flex-col  hover:cursor-pointer user-select-none hover:shadow-xl transition-all col-span-1">
            <Trophy className="" />
            <h3 className="mt-4 font-bold text-xl ">{tier_name}</h3>
            <p className="text-sm gray-500 dark:text-gray-400">
                Complete bookings within{" "}
                <span className="font-bold ">{points_to_next_tier}</span> points
                to upgrade to the next tier
            </p>
        </section>
    );
}

export default LoyaltyPoints;
