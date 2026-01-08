"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCurrency } from "@/app/_modules/currency/hooks/useCurrency";
import PlanSummarySidebar from "./PlanSummarySidebar";
import PayInInstallments from "@/app/_components/ui/PayInInstallments";
import LoyaltyPoints from "@/app/_modules/loyalty/components/organisms/LoyaltyPoints";

/**
 * Dialog for mobile that shows PlanSummarySidebar content
 * Similar to FareSummaryDialog in Flight module
 */
export default function PlanSummaryDialog({
    quote,
    onProceedToPayment,
    loading,
    totalAmount,
}) {
    const t = useTranslations("Insurance");
    const { formatPrice } = useCurrency();

    return (
        <Dialog>
            <DialogTrigger className="w-full">
                <div className="flex items-center justify-between gap-4 mb-3 w-full">
                    {/* Left: Loyalty Points + Pay in Installments */}
                    <div className="flex flex-col gap-1">
                        <LoyaltyPoints price={totalAmount} />
                        <PayInInstallments />
                    </div>

                    {/* Right: Total + Price */}
                    <div className="flex flex-col justify-start">
                        <div className="text-xs font-semibold flex items-center gap-2">
                            {t("booking.total_fare")}
                            <ChevronUp className="size-5" />
                        </div>
                        <div className="text-xl text-accent-500 font-semibold flex justify-end">
                            {formatPrice(totalAmount)}
                        </div>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="w-full max-w-none h-[90vh] overflow-y-auto fixed top-150 open-slide-bottom close-slide-bottom py-10">
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription asChild>
                        <div>
                            <PlanSummarySidebar
                                quote={quote}
                                onProceedToPayment={onProceedToPayment}
                                loading={loading}
                            />
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
