import { Check, Info, Loader2, Ticket } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";
import PlanDetailsDialog from "./PlanDetailsDialog";
import { benefits } from "../../constants/benefits";
import { useCurrency } from "@/app/_modules/currency/hooks/useCurrency";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import ChevronBasedOnLanguage from "@/app/_components/ui/ChevronBasedOnLanguage";

function PlanSummarySidebar({ quote, onProceedToPayment, loading }) {
    const t = useTranslations("Insurance.booking");
    const r = useTranslations("Insurance.results");
    const { formatPrice } = useCurrency();
    const BasePrice = quote.scheme.premium;
    const Taxes = 0;
    const { theme } = useTheme();
    return (
        <div className="rounded-2xl border border-border bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg p-6 space-y-6 sticky top-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 className="text-xl font-semibold capitalize rtl:text-right text-primary-700 dark:text-primary-100">
                    {t("plan_summary")}
                </h3>
                <PlanDetailsDialog
                    quote={quote}
                    withContinue={false}
                    trigger={{
                        title: t("plan_details"),
                        icon: <Ticket className="w-4 h-4" />,
                    }}
                />
            </div>

            {/* Baggage Info */}
            <div className="pb-4 border-b border-border space-y-4">
                <h4 className="text-md font-semibold text-primary-600 dark:text-primary-200 rtl:text-right text-left">
                    {t("details")}
                </h4>

                <div className="flex justify-between text-sm">
                    <Tooltip>
                        <TooltipTrigger className="text-sm">
                            <span className="  border-dashed flex items-center gap-1">
                                <Check className="size-5 text-green-500 shrink-0" />
                                {t("plan_type")}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[220px] text-xs leading-snug text-center">
                            <p>{t("plan_type_helper")}</p>
                        </TooltipContent>
                    </Tooltip>
                    <span className=" font-bold">
                        {r(
                            quote.scheme.name
                                .split("-")[1]
                                .toLowerCase()
                                .trim()
                                .split(" ")
                                .join("_")
                        ) || quote.scheme.name.split("-")[1]}
                    </span>
                </div>
                {quote.scheme.benefits
                    .filter((benefit) =>
                        benefits.some((b) =>
                            benefit.cover
                                .toLowerCase()
                                .includes(b.toLowerCase())
                        )
                    )
                    .map((benefit) => (
                        <div
                            key={benefit.cover}
                            className="flex justify-between items-start text-sm group mb-2"
                        >
                            <div className="flex items-center gap-2 mb-3 min-w-0 flex-1">
                                <Check className="size-5 text-green-500 shrink-0" />
                                <span className="font-medium truncate">
                                    {benefit.cover
                                        .toLowerCase()
                                        .includes("emergency medical")
                                        ? r("emergency_medical")
                                        : r(
                                              benefit.cover
                                                  .toLowerCase()
                                                  .trim()
                                                  .split(" ")
                                                  .join("_")
                                          )}
                                </span>
                            </div>
                            <span className="cursor-help font-bold">
                                {benefit.amount.length > 20
                                    ? r("more")
                                    : benefit.amount === "Not Covered"
                                    ? r("not_covered")
                                    : benefit.amount}
                            </span>
                        </div>
                    ))}
            </div>

            {/* Price Details */}
            <div className="space-y-4">
                <h4 className="text-md font-semibold text-primary-600 dark:text-primary-200 rtl:text-right capitalize text-left">
                    {t("price_details")}
                </h4>

                {[
                    { label: t("base_fare"), value: BasePrice },
                    { label: t("taxes_and_fees"), value: Taxes },
                ].map((row, i) => (
                    <div key={i} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                            {row.label}
                        </span>
                        <span className="font-semibold text-primary-700 dark:text-primary-200">
                            {formatPrice(
                                row.value,
                                theme == "dark" ? "white" : "black",
                                12
                            )}
                        </span>
                    </div>
                ))}

                <div className="border-t border-border"></div>

                <div className="flex justify-between items-center font-semibold">
                    <span className="text-lg text-primary-700 dark:text-primary-200">
                        {t("total_fare")}
                    </span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-accent-500 to-accent-400 bg-clip-text text-transparent">
                        {formatPrice(BasePrice + Taxes)}
                    </span>
                </div>
            </div>

            {onProceedToPayment && (
                <Button
                    onClick={onProceedToPayment}
                    className="
                    w-full py-5 text-md font-semibold
                    bg-gradient-to-r from-accent-500 to-accent-400
                    hover:from-accent-600 hover:to-accent-500
                    text-white shadow-md hover:shadow-lg
                    transition-all duration-300 cursor-pointer rounded-sm rtl:flex-row-reverse ltr:flex-row-reverse
                        "
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        <ChevronBasedOnLanguage size="5" />
                    )}
                    {t("proceed_to_payment")}
                </Button>
            )}
        </div>
    );
}

export default PlanSummarySidebar;
