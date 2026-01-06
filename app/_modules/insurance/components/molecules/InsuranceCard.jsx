"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import { useCurrencyStore } from "@/app/_modules/currency/store/useCurrencyStore";
import { motion } from "framer-motion"; // 1. استيراد motion

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";

import PlanDetailsDialog from "./PlanDetailsDialog";
import { benefits } from "../../constants/benefits";
import { useTranslations } from "next-intl";

// 2. تعريف إعدادات الحركة (Variants)
const cardVariants = {
    hidden: { opacity: 0, y: 20 }, // الحالة الابتدائية (مخفي وتحت بـ 20 بكسل)
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.2, // التأخير المتسلسل بناءً على رقم الكارت
            duration: 0.4,
            ease: "easeOut",
        },
    }),
};

function InsuranceCard({ quote, index }) {
    const { formatPrice } = useCurrencyStore();
    const t = useTranslations("Insurance.results");

    return (
        // 3. تحويل الحاوية الخارجية إلى motion.div
        <motion.div
            custom={index} // نمرر الـ index للتحكم في التوقيت
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="h-full" // لضمان ثبات الطول داخل الـ Grid
        >
            <Card className="block hover:shadow-lg transition-shadow duration-300 pb-0 h-full ">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-4">
                        <CardTitle className="text-xl font-bold text-primary">
                            {t(
                                quote.scheme.name
                                    .split("-")[1]
                                    .toLowerCase()
                                    .trim()
                                    .split(" ")
                                    .join("_")
                            ) || quote.scheme.name.split("-")[1]}
                        </CardTitle>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                                {t("price")}
                            </p>
                            <span className="text-2xl font-bold text-green-600">
                                {formatPrice(
                                    Math.round(quote.scheme.premium),
                                    "green",
                                    15
                                )}
                            </span>
                        </div>
                    </div>
                </CardHeader>

                <Separator />

                <CardContent className="pt-2 flex-1">
                    <h4 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider mt-2">
                        {t("included_benefits")}
                    </h4>
                    <div className="space-y-3">
                        <TooltipProvider>
                            {" "}
                            {/* تأكد من وجود الـ Provider */}
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
                                                    .includes(
                                                        "emergency medical"
                                                    )
                                                    ? t("emergency_medical")
                                                    : t(
                                                          benefit.cover
                                                              .toLowerCase()
                                                              .trim()
                                                              .split(" ")
                                                              .join("_")
                                                      )}
                                            </span>
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            className="font-mono shrink-0 ml-2"
                                        >
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="cursor-help">
                                                        {benefit.amount.length >
                                                        20 // قللت الرقم ليتناسب مع الكارت
                                                            ? t("more")
                                                            : benefit.amount ===
                                                              "Not Covered"
                                                            ? t("not_covered")
                                                            : benefit.amount}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>
                                                        {benefit.amount ===
                                                        "Not Covered"
                                                            ? t("not_covered")
                                                            : benefit.amount}
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </Badge>
                                    </div>
                                ))}
                        </TooltipProvider>
                    </div>
                </CardContent>

                <div className="p-6 pt-2 mt-auto">
                    <PlanDetailsDialog quote={quote} />
                </div>
            </Card>
        </motion.div>
    );
}

export default InsuranceCard;
