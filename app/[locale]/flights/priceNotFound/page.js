"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { AlertCircle, Search, Home, RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";

export default function PriceNotFoundPage() {
    const router = useRouter();
    const t = useTranslations("Flight");

    return (
        <div className="flex items-center justify-center ">
            <div className="max-w-2xl w-full">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-6 text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"></div>
                            <div className="relative bg-red-100 dark:bg-red-900/30 rounded-full p-6">
                                <AlertCircle className="h-16 w-16 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Flight No Longer Available
                    </h1>

                    {/* Description */}
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
                        Unfortunately, this flight is no longer available for
                        booking. Flight prices and availability change rapidly.
                    </p>

                    {/* Info Box */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-8 text-left">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <RefreshCcw className="h-5 w-5 text-blue-600" />
                            What You Can Do:
                        </h3>
                        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 dark:text-blue-400 mt-1">
                                    •
                                </span>
                                <span>
                                    <strong>Search again</strong> - Similar
                                    flights may still be available
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 dark:text-blue-400 mt-1">
                                    •
                                </span>
                                <span>
                                    <strong>Try flexible dates</strong> -
                                    Adjusting your travel dates by a day or two
                                    might reveal more options
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 dark:text-blue-400 mt-1">
                                    •
                                </span>
                                <span>
                                    <strong>
                                        Consider alternative airports
                                    </strong>{" "}
                                    - Check nearby departure or arrival airports
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 dark:text-blue-400 mt-1">
                                    •
                                </span>
                                <span>
                                    <strong>Book quickly</strong> - When you
                                    find a suitable flight, complete your
                                    booking promptly
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Why This Happens */}
                    <details className="mb-8 text-left">
                        <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium">
                            Why did this happen?
                        </summary>
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-sm text-gray-600 dark:text-gray-400 space-y-2">
                            <p>
                                Flight availability and prices are updated in
                                real-time by airlines. Common reasons include:
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                                <li>
                                    The last seat at this price was just booked
                                </li>
                                <li>The airline adjusted their pricing</li>
                                <li>The flight schedule was modified</li>
                                <li>
                                    Seats were held too long without booking
                                </li>
                            </ul>
                        </div>
                    </details>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            onClick={() => router.back()}
                            size="lg"
                            className="btn-primary"
                        >
                            <Search className="h-5 w-5 mr-2" />
                            Search Again
                        </Button>

                        <Button
                            onClick={() => router.push("/")}
                            variant="outline"
                            size="lg"
                            className="px-8"
                        >
                            <Home className="h-5 w-5 mr-2" />
                            Go to Home
                        </Button>
                    </div>

                    {/* Additional Help */}
                    <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                        Need help? Contact our support team at{" "}
                        <a
                            href="mailto:support@example.com"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            support@example.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
