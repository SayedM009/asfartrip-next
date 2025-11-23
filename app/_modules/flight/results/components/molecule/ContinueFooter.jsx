"use client";

import LoyaltyPoints from "@/app/_modules/loyalty/components/organisms/LoyaltyPoints";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function ContinueFooter({
    t,
    TotalPrice,
    isChecking,
    handleContinue,
    formatPrice,
}) {
    return (
        <div className="sticky -bottom-6 w-full p-3 bg-white dark:bg-muted rounded-t-2xl">
            <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full">
                <div className="flex-1 flex justify-between sm:flex-col sm:items-start">
                    <LoyaltyPoints price={TotalPrice} />

                    <div className="flex items-center gap-2 font-semibold">
                        <span className="text-xs">
                            {t("dialog.total_price")}
                        </span>
                        <span className="text-accent-400 text-lg">
                            {formatPrice(TotalPrice)}
                        </span>
                    </div>
                </div>

                <Button
                    onClick={handleContinue}
                    className="btn-primary flex-1"
                    disabled={isChecking}
                >
                    {isChecking ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            {t("dialog.checking")}
                        </>
                    ) : (
                        t("dialog.continue")
                    )}
                </Button>
            </div>
        </div>
    );
}
