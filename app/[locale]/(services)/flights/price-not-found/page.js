"use client";

import BottomAppBar from "@/app/_components/layout/bottomAppBar/BottomAppBar";
import Navbar from "@/app/_components/layout/Navbar";
import { Button } from "@/components/ui/button";
import {
    Search,
    Home,
    Clock,
    Calendar,
    MapPin,
    Plane,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function PriceNotFoundPage() {
    const t = useTranslations("Flight.operations");

    const handleSearchAgain = () => {
        window.history.back();
    };

    const handleGoHome = () => {
        window.location.href = "/";
    };

    return (
        <>
            <Navbar />
            <div className="container-custom  ">
                {/* Main Card with Gradient Background */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-primary-900 dark:via-background dark:to-accent-900/20 border border-border shadow-lg">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                    {/* Content */}
                    <div className="relative z-10 px-4 pt-6 pb-2 md:px-12 md:py-14">
                        {/* Icon and Title Section */}
                        <div className="text-center mb-6 md:mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 shadow-lg mb-4 md:mb-6 animate-bounce">
                                <Plane className="w-8 h-8 md:w-12 md:h-12 text-white" />
                            </div>

                            <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 md:mb-3">
                                {t("price_not_found_title")}
                            </h1>

                            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
                                {t("price_not_found_subtitle")}
                            </p>
                        </div>

                        {/* Suggestions Section */}
                        <div className="mb-5 md:mb-8">
                            <h2 className="text-base md:text-xl font-semibold text-foreground mb-3 md:mb-5 text-center">
                                {t("what_you_can_do")}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                                {/* Suggestion 1 */}
                                <div className="group p-3 md:p-5 rounded-lg md:rounded-xl bg-card border border-border hover:border-accent-500 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                                    <div className="flex items-start gap-2 md:gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Search className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm md:text-base font-medium text-foreground mb-0.5 md:mb-1">
                                                {t("search_similar")}
                                            </p>
                                            <p className="text-xs md:text-sm text-muted-foreground">
                                                {t("search_similar_desc")}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Suggestion 2 */}
                                <div className="group p-3 md:p-5 rounded-lg md:rounded-xl bg-card border border-border hover:border-accent-500 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                                    <div className="flex items-start gap-2 md:gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm md:text-base font-medium text-foreground mb-0.5 md:mb-1">
                                                {t("adjust_dates")}
                                            </p>
                                            <p className="text-xs md:text-sm text-muted-foreground">
                                                {t("adjust_dates_desc")}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Suggestion 3 */}
                                <div className="group p-3 md:p-5 rounded-lg md:rounded-xl bg-card border border-border hover:border-accent-500 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                                    <div className="flex items-start gap-2 md:gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <MapPin className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm md:text-base font-medium text-foreground mb-0.5 md:mb-1">
                                                {t("try_nearby")}
                                            </p>
                                            <p className="text-xs md:text-sm text-muted-foreground">
                                                {t("try_nearby_desc")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Why This Happens Section */}
                        <div className="mb-5 md:mb-8 p-3 md:p-5 rounded-lg md:rounded-xl bg-gradient-to-r from-blue-50 to-primary-50 dark:from-blue-950/30 dark:to-primary-950/30 border border-blue-200 dark:border-blue-900/50">
                            <div className="flex items-start gap-2 md:gap-3">
                                <Clock className="w-4 h-4 md:w-5 md:h-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm md:text-base font-semibold text-foreground mb-1 md:mb-2">
                                        {t("why_happened")}
                                    </p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {t("why_happened_desc")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mb-4 md:mb-6">
                            <Button
                                onClick={handleSearchAgain}
                                size="lg"
                                className="btn-primary flex-1 h-11 md:h-12 text-sm md:text-base font-semibold shadow-md hover:shadow-lg transition-all py-2"
                            >
                                <Search className="w-5 h-5 mr-2" />
                                {t("search_again")}
                            </Button>

                            <Button
                                onClick={handleGoHome}
                                variant="outline"
                                size="lg"
                                className="flex-1 sm:flex-none h-11 md:h-12 text-sm md:text-base font-semibold border-2 hover:bg-accent hover:text-accent-foreground hover:border-accent-500 transition-all py-2"
                            >
                                <Home className="w-5 h-5 mr-2" />
                                {t("back_to_home")}
                            </Button>
                        </div>

                        {/* Support Link */}
                        <div className="text-center pt-2 md:pt-6 border-t border-border">
                            <p className="text-sm text-muted-foreground">
                                {t("need_assistance")}{" "}
                                <a
                                    href="/contact"
                                    className="text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 font-medium hover:underline transition-colors"
                                >
                                    {t("contact_support")}
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <BottomAppBar />
        </>
    );
}
