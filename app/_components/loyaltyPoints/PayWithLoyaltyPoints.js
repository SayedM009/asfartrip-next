"use client";

import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { useCurrency } from "@/app/_context/CurrencyContext";
import { useTranslations } from "next-intl";
import useLoyaltyStore from "@/app/_store/loyaltyStore";
import useAuthStore from "@/app/_store/authStore";

export default function PayWithLoyaltyPoints() {
    const l = useTranslations("Loyalty.pay_with_points");
    const { formatPrice } = useCurrency();
    const { status } = useAuthStore();
    const { balance, calculateBalanceValue, isLoading } = useLoyaltyStore();
    if (status !== "authenticated") return null;

    if (isLoading) {
        return (
            <section className="border-2 border-dashed py-2 px-3 rounded-lg animate-pulse bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col gap-3">
                    <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                            <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 w-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="h-6 w-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                    </div>
                </div>
            </section>
        );
    }

    const moneyValue = calculateBalanceValue();
    const hasBalance = balance > 0;

    return (
        <section className="border-2 py-2 px-3 rounded-lg border-dashed">
            <h3 className="m-0 p-0 text-md capitalize font-semibold">
                {l("title")}
            </h3>

            <div className="flex items-center gap-2 mt-2">
                <Image
                    src="/icons/pay-with-coins.png"
                    alt="Pay with coins"
                    width={30}
                    height={30}
                />
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 text-sm sm:text-base">
                        <Image
                            src="/icons/pay-with-coin.png"
                            alt="Pay with coins"
                            width={15}
                            height={15}
                        />
                        <span className="font-semibold">{balance}</span>
                        <p className="capitalize">{l("points")} =</p>
                        <span className="text-emerald-600 font-semibold">
                            {formatPrice(moneyValue)}
                        </span>
                    </div>
                    <Switch
                        id="payWithPoints"
                        disabled={!hasBalance}
                        className={`${
                            hasBalance
                                ? "bg-accent-500 cursor-pointer"
                                : "opacity-50 cursor-not-allowed"
                        }`}
                        dir="ltr"
                    />
                </div>
            </div>
            {!hasBalance && (
                <p className="text-xs text-gray-500 mt-1">{l("warning")}</p>
            )}
        </section>
    );
}
