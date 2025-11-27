import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import FareSummaryDialog from "../organism/FareSummaryDialog";
import ChevronBasedOnLanguage from "@/app/_components/ui/ChevronBasedOnLanguage";

export default function MobileBottomBar({
    t,
    handleProceedToPayment,
    loading,
}) {
    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-border shadow-lg z-50">
            <div className="p-3">
                <FareSummaryDialog />

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
