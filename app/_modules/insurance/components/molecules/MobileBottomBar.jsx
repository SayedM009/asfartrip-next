"use client";

import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChevronBasedOnLanguage from "@/app/_components/ui/ChevronBasedOnLanguage";
import { useTranslations } from "next-intl";
import PlanSummaryDialog from "./PlanSummaryDialog";
import { useKeyboardVisible } from "@/app/_hooks/useKeyboardVisible";

/**
 * Mobile Bottom Bar for Insurance booking
 * Shows PlanSummaryDialog trigger and proceed to payment button
 * Hides when keyboard is open
 */
export default function MobileBottomBar({
    handleProceedToPayment,
    loading,
    quote,
}) {
    const t = useTranslations("Insurance");
    const isKeyboardVisible = useKeyboardVisible();

    // Hide when keyboard is open
    if (isKeyboardVisible) return null;

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50">
            <div className="p-3">
                {/* Plan Summary Dialog Trigger */}
                <PlanSummaryDialog
                    quote={quote}
                    // onProceedToPayment={handleProceedToPayment}
                    loading={loading}
                    totalAmount={quote?.scheme?.premium || 0}
                />

                <Button
                    onClick={handleProceedToPayment}
                    size="lg"
                    disabled={loading}
                    className="btn-primary rtl:flex-row-reverse ltr:flex-row-reverse w-full"
                >
                    {loading ? (
                        <Loader className="h-5 w-5 animate-spin" />
                    ) : (
                        <ChevronBasedOnLanguage size="5" />
                    )}

                    {t("booking.proceed_to_payment")}
                </Button>
            </div>
        </div>
    );
}
