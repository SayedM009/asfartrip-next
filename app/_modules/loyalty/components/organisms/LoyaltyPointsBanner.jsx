import { useTranslations } from "next-intl";
import Image from "next/image";
import useLoyaltyStore from "../../store/loyaltyStore";
import useAuthStore from "@/app/_modules/auth/store/authStore";

export default function LoyaltyPointsBanner({ price }) {
    const l = useTranslations("Loyalty.Banner");
    const { tier, config, calculatePoints, isLoading } = useLoyaltyStore();
    const { status } = useAuthStore();
    const points = calculatePoints(price);

    if (status !== "authenticated") return null;

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

// import Image from "next/image";
// import { useSession } from "next-auth/react";
// import useLoyaltyStore from "@/app/_store/loyaltyStore";
// import { useEffect, useState } from "react";
// import { useTranslations } from "next-intl";

// function LoyaltyPointsBanner({ price }) {
//     const l = useTranslations("Loyalty.Banner");
//     const { data: session, status } = useSession();
//     const { config, tier, fetchConfig, fetchTier, calculatePoints, isLoading } =
//         useLoyaltyStore();
//     const [points, setPoints] = useState(0);

//     useEffect(() => {
//         const load = async () => {
//             if (!config) await fetchConfig();
//             if (session?.user?.id) await fetchTier(52);
//             const pts = calculatePoints(price);
//             setPoints(pts);
//         };
//         load();
//     }, [
//         price,
//         config,
//         session?.user?.id,
//         fetchConfig,
//         fetchTier,
//         calculatePoints,
//     ]);

//     // ✅ Skeleton Loader أثناء التحميل
//     if (isLoading || status === "loading") {
//         return (
//             <div className="p-6 sm:mb-5 rounded-lg relative flex items-center justify-between bg-gray-200 dark:bg-gray-800 animate-pulse">
//                 {/* الخط اللى يمثل النص */}
//                 <div className="h-4 sm:h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
//                 {/* دوائر لتمثيل الأيقونات */}
//                 <div className="flex gap-2">
//                     <div className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-700" />
//                     <div className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-700" />
//                 </div>
//             </div>
//         );
//     }

//     if (status === "unauthenticated") return null;

//     const tierColors = {
//         Bronze: {
//             from: "var(--tier-bronze-from)",
//             to: "var(--tier-bronze-to)",
//         },
//         Silver: {
//             from: "var(--tier-silver-from)",
//             to: "var(--tier-silver-to)",
//         },
//         Gold: {
//             from: "var(--tier-gold-from)",
//             to: "var(--tier-gold-to)",
//         },
//         Platinum: {
//             from: "var(--tier-platinum-from)",
//             to: "var(--tier-platinum-to)",
//         },
//     };

//     const gradient = tierColors[tier?.tier_name] || tierColors.Bronze;

//     return (
//         <div
//             className="text-white px-5 py-6 sm:p-5 sm:mb-5 rounded-lg relative flex justify-between"
//             style={{
//                 background: `linear-gradient(to left, ${gradient.from}, ${gradient.to})`,
//             }}
//         >
//             <p className="text-xs sm:text-lg font-semibold">
//                 {tier?.tier_name
//                     ? l("with_tier", { tier: tier.tier_name, points })
//                     : l("without_tier", { points })}
//             </p>

//             {/* رموز العملة */}
//             <Image
//                 src="/icons/coin-B.png"
//                 alt="coins"
//                 width={25}
//                 height={25}
//                 className="absolute left-[90%] sm:left-[94%] top-1 sm:top-2 rtl:left-10"
//             />
//             <Image
//                 src="/icons/coin.png"
//                 alt="coins"
//                 width={30}
//                 height={30}
//                 className="absolute left-[88%] sm:left-[92%] top-5 sm:top-7 rtl:left-8"
//             />
//         </div>
//     );
// }

// export default LoyaltyPointsBanner;
