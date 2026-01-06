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
function PlanDetailsDialog({ quote }) {
    const t = useTranslations("Insurance.results");
    return (
        <Dialog dir="ltr">
            <DialogTrigger className="w-full" dir="ltr">
                <button className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:opacity-90 transition-opacity cursor-pointer">
                    {t("plan_details")}
                </button>
            </DialogTrigger>
            <DialogContent
                className={cn(
                    "dialog-bg",
                    "max-w-none h-full overflow-auto rounded-none border-0 md:rounded sm:fixed md:left-[75%] lg:left-[80%] xl:left-[83%] 2xl:left-[87%]",
                    "open-slide-right close-slide-right"
                )}
                dir="ltr"
            >
                <DialogHeader dir="ltr">
                    <DialogTitle
                        className="text-lg font-semibold text-left rtl:text-right"
                        dir="rtl"
                    >
                        {quote.scheme.name.split("-")[1] || quote.scheme.name} -
                        Plan Details
                    </DialogTitle>
                    <DialogDescription dir="ltr">
                        <h4 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider text-left  mt-6">
                            Included Benefits
                        </h4>
                        <div className="space-y-3">
                            {quote.scheme.benefits.map((benefit) => (
                                <div
                                    key={benefit.cover}
                                    className="flex justify-between items-start text-sm group mb-2"
                                    dir="ltr"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        {/* <Check className="size-5 text-green-500 shrink-0" /> */}
                                        <span className="font-medium  text-left rtl:text-right">
                                            {benefit.cover
                                                .toLowerCase()
                                                .includes("emergency medical")
                                                ? "Emergency Medical"
                                                : benefit.cover}
                                        </span>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="font-mono"
                                    >
                                        <Tooltip dir="ltr">
                                            <TooltipTrigger>
                                                {benefit.amount.length > 30
                                                    ? "more"
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
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default PlanDetailsDialog;
