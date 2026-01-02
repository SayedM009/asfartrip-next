import { useTranslations } from "next-intl";
import Image from "next/image";
import useLoyaltyStore from "../../store/loyaltyStore";

export default function LoyaltyPointsBanner({ price }) {
    const l = useTranslations("Loyalty.Banner");
    const { tier, config, calculatePoints, isLoading } = useLoyaltyStore();

    // Gate on presence of config - only populated after auth sync via LoyaltyInitializer
    // null config means either session not confirmed OR unauthenticated
    if (!config) return null;

    const points = calculatePoints(price);

    if (isLoading || !config) {
        return (
            <div className="p-6 sm:mb-5 rounded-lg relative flex items-center justify-between bg-gray-200 dark:bg-gray-800 animate-pulse">
                <div className="h-4 sm:h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                <div className="flex gap-2">
                    <div className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-700" />
                    <div className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-700" />
                </div>
            </div>
        );
    }

    const tierColors = {
        Bronze: {
            from: "var(--tier-bronze-from)",
            to: "var(--tier-bronze-to)",
        },
        Silver: {
            from: "var(--tier-silver-from)",
            to: "var(--tier-silver-to)",
        },
        Gold: { from: "var(--tier-gold-from)", to: "var(--tier-gold-to)" },
        Platinum: {
            from: "var(--tier-platinum-from)",
            to: "var(--tier-platinum-to)",
        },
    };

    const gradient = tierColors[tier?.tier_name] || tierColors.Bronze;

    return (
        <div
            className="text-white px-5 py-6 sm:p-5 sm:mb-5 rounded-lg relative flex justify-between"
            style={{
                background: `linear-gradient(to left, ${gradient.from}, ${gradient.to})`,
            }}
        >
            <p className="text-xs sm:text-lg font-semibold">
                {tier?.tier_name
                    ? l("with_tier", { tier: tier.tier_name, points })
                    : l("without_tier", { points })}
            </p>

            <Image
                src="/icons/coin-B.png"
                alt="coins"
                width={25}
                height={25}
                className="absolute left-[90%] sm:left-[94%] top-1 sm:top-2 rtl:left-10"
            />
            <Image
                src="/icons/coin.png"
                alt="coins"
                width={30}
                height={30}
                className="absolute left-[88%] sm:left-[92%] top-5 sm:top-7 rtl:left-8"
            />
        </div>
    );
}
