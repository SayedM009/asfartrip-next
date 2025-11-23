"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

import { BOOKING_STEPS } from "../../config/steps.config";

export default function BookingSteps({ currentStep }) {
    const t = useTranslations("Flight");

    return (
        <div className="hidden lg:block bg-transparent border-b border-border">
            <div className="max-w-7xl mx-auto py-4">
                <div className="flex items-center justify-between">
                    {BOOKING_STEPS.map((step, index) => (
                        <React.Fragment key={step.id}>
                            {/* STEP NUMBER / CHECK ICON */}
                            <div className="flex items-center gap-3">
                                <div
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                                        step.id < currentStep
                                            ? "bg-green-600 text-white"
                                            : step.id === currentStep
                                            ? "bg-accent-500 text-white"
                                            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                                    )}
                                >
                                    {step.id < currentStep ? (
                                        <Check className="w-4 h-4" />
                                    ) : (
                                        <span className="text-sm">
                                            {step.id}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <div
                                        className={cn(
                                            "text-sm",
                                            step.id <= currentStep
                                                ? "text-foreground"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        {t(step.i18nKey)}
                                    </div>

                                    {step.id < currentStep && (
                                        <div className="text-xs text-green-600 dark:text-green-500">
                                            {t("booking.complated")}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* CONNECTOR */}
                            {index < BOOKING_STEPS.length - 1 && (
                                <div
                                    className={cn(
                                        "flex-1 h-0.5 mx-3",
                                        step.id < currentStep
                                            ? "bg-green-600"
                                            : "bg-gray-200 dark:bg-gray-700"
                                    )}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}
