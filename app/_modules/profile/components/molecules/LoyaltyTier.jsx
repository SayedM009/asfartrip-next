"use client";
import useLoyaltyStore from "@/app/_modules/loyalty/store/loyaltyStore";
import { Trophy } from "lucide-react";
import { useTranslations } from "next-intl";

export default function LoyaltyTier() {
    const {
        tier: { points_to_next_tier, tier_name },
    } = useLoyaltyStore();
    const p = useTranslations("Loyalty");
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

                <Trophy className="w-6 h-6 text-white relative z-10" />
            </div>

            <h3 className="mt-4 font-bold text-xl mb-2">{p(tier_name)}</h3>
            <p className="text-sm gray-500 dark:text-gray-400">
                {p("complete_bookings_to_upgrade", {
                    points: points_to_next_tier,
                })}
            </p>
        </section>
    );
}
