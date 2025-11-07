"use client";

import { Button } from "@/components/ui/button";
import {
    AlertTriangle,
    Search,
    Home,
    Clock,
    Calendar,
    MapPin,
} from "lucide-react";

export default function PriceNotFoundPage() {
    const handleSearchAgain = () => {
        window.history.back();
    };

    const handleGoHome = () => {
        window.location.href = "/";
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full">
                {/* Main Container */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    {/* Icon and Title Section */}
                    <div className="px-6 py-10 md:px-10 md:py-12 text-center border-b border-gray-100 dark:border-gray-800">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/20 mb-6">
                            <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-500" />
                        </div>

                        <h1 className="text-gray-900 dark:text-white mb-3">
                            Flight No Longer Available
                        </h1>

                        <p className="text-gray-600 dark:text-gray-400">
                            This flight is no longer available for booking.
                            Prices and availability update in real-time.
                        </p>
                    </div>

                    {/* Content Section */}
                    <div className="px-6 py-8 md:px-10 md:py-10">
                        {/* Suggestions */}
                        <div className="space-y-4 mb-8">
                            <h2 className="text-gray-900 dark:text-white">
                                Here&apos;s what you can do:
                            </h2>

                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                    <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-gray-900 dark:text-white">
                                            Search for similar flights
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Other options may be available for
                                            your route
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-gray-900 dark:text-white">
                                            Adjust your travel dates
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Flexible dates often have more
                                            availability
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-gray-900 dark:text-white">
                                            Try nearby airports
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Alternative airports may offer
                                            better options
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Why This Happens */}
                        <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-900 dark:text-white mb-2">
                                        <strong>Why did this happen?</strong>
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Flight prices and availability change
                                        constantly. This fare may have been
                                        booked by another customer, or the
                                        airline adjusted their pricing.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                onClick={handleSearchAgain}
                                size="lg"
                                className="btn-primary flex-1"
                            >
                                <Search className="w-5 h-5 mr-2" />
                                Search Again
                            </Button>

                            <Button
                                onClick={handleGoHome}
                                variant="outline"
                                size="lg"
                                className="flex-1 sm:flex-none sm:px-8"
                            >
                                <Home className="w-5 h-5 mr-2" />
                                Back to Home
                            </Button>
                        </div>

                        {/* Support Link */}
                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Need assistance?{" "}
                                <a
                                    href="mailto:support@example.com"
                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Contact Support
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
