import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
    { number: 1, title: "Flight Selection" },
    { number: 2, title: "Enter Traveler Information" },
    { number: 3, title: "Payment" },
];

export default function BookingSteps({ currentStep }) {
    return (
        <div className="hidden lg:block bg-transparent  border-b border-border">
            <div className="max-w-7xl mx-auto  py-4">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.number}>
                            {/* Step Circle and Text */}
                            <div className="flex items-center gap-3">
                                <div
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                                        step.number < currentStep
                                            ? "bg-green-600 text-white"
                                            : step.number === currentStep
                                            ? "bg-accent-500 text-white"
                                            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                                    )}
                                >
                                    {step.number < currentStep ? (
                                        <Check className="w-4 h-4" />
                                    ) : (
                                        <span className="text-sm">
                                            {step.number}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <div
                                        className={cn(
                                            "text-sm",
                                            step.number <= currentStep
                                                ? "text-foreground"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        {step.title}
                                    </div>
                                    {step.number < currentStep && (
                                        <div className="text-xs text-green-600 dark:text-green-500">
                                            Completed
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div
                                    className={cn(
                                        "flex-1 h-0.5 mx-3",
                                        step.number < currentStep
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
