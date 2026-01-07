"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useCurrencyStore } from "@/app/_modules/currency/store/useCurrencyStore";
import { Loader2, AlertCircle } from "lucide-react";
import useHandleBookNow from "@/app/_modules/insurance/hooks/useHandleBookNow";

function PlanDetailsDialog({ quote }) {
    const { formatPrice } = useCurrencyStore();
    const t = useTranslations("Insurance.results");
    const { handleBookNow, isLoading, error, success } = useHandleBookNow();
    return (
        <Dialog dir="ltr">
            <DialogTrigger className="w-full" dir="ltr">
                <button className="w-full bg-accent-500 text-primary-foreground py-2 rounded-md hover:opacity-90 transition-opacity cursor-pointer dark:text-white">
                    {t("plan_details")}
                </button>
            </DialogTrigger>
            <DialogContent
                className={cn(
                    "dialog-bg",
                    "max-w-none h-full overflow-auto rounded-none border-0 md:rounded sm:fixed md:left-[75%] lg:left-[80%] xl:left-[83%] 2xl:left-[87%] pb-0",
                    "open-slide-right close-slide-right"
                )}
                dir="ltr"
            >
                <DialogHeader dir="ltr">
                    <DialogTitle className="text-lg font-semibold rtl:text-right">
                        {quote.scheme.name.split("-")[1] || quote.scheme.name} -
                        Plan Details
                    </DialogTitle>
                    <DialogDescription dir="ltr">
                        <h4 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider text-left mt-6">
                            Included Benefits
                        </h4>
                        <div className="space-y-3  pr-2">
                            {quote.scheme.benefits.map((benefit, idx) => (
                                <div
                                    key={`${benefit.cover}-${idx}`}
                                    className="flex justify-between items-start text-sm gap-4 pb-2 border-b border-border/50"
                                    dir="ltr"
                                >
                                    <span className="font-medium text-left flex-1">
                                        {benefit.cover
                                            .toLowerCase()
                                            .includes("emergency medical")
                                            ? "Emergency Medical"
                                            : benefit.cover}
                                    </span>
                                    <Badge
                                        variant="secondary"
                                        className="font-mono text-xs shrink-0"
                                    >
                                        <Tooltip dir="ltr">
                                            <TooltipTrigger>
                                                {benefit.amount.length > 20
                                                    ? benefit.amount.substring(
                                                          0,
                                                          20
                                                      ) + "..."
                                                    : benefit.amount}
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{benefit.amount}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </Badge>
                                </div>
                            ))}
                        </div>

                        {error && (
                            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md text-sm flex items-start gap-2">
                                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                <div>
                                    <div className="font-semibold mb-1">
                                        Error
                                    </div>
                                    <div className="text-xs">{error}</div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center mt-6 pt-4 border-t sticky bottom-[3px] w-full  bg-background">
                            <div>
                                <div className="text-sm text-muted-foreground">
                                    {t("price")}
                                </div>
                                <div className="text-2xl font-bold">
                                    {formatPrice(quote.scheme.premium)}
                                </div>
                            </div>
                            <button
                                onClick={() => handleBookNow(quote)}
                                disabled={isLoading || success}
                                className="bg-accent-500 dark:text-white text-primary-foreground py-3 px-8 rounded-md hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[140px] justify-center font-semibold"
                            >
                                {isLoading && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                )}

                                {success
                                    ? t("added")
                                    : isLoading
                                    ? t("adding")
                                    : t("book_now")}
                            </button>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default PlanDetailsDialog;
