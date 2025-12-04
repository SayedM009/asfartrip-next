"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }) {
    const t = useTranslations("ErrorPage");

    useEffect(() => {
        console.error("🔥 Global Error:", error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 px-4">
                    <div className="max-w-md w-full">
                        {/* Error Icon */}
                        <div className="flex justify-center mb-8">
                            <div className="relative">
                                <div className="absolute inset-0 bg-red-500/20 dark:bg-red-500/10 rounded-full blur-xl animate-pulse" />
                                <div className="relative bg-red-100 dark:bg-red-900/30 p-6 rounded-full">
                                    <AlertTriangle className="w-16 h-16 text-red-600 dark:text-red-400" />
                                </div>
                            </div>
                        </div>

                        {/* Error Title */}
                        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-3">
                            {t("title")}
                        </h1>

                        {/* Error Description */}
                        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                            {t("description")}
                        </p>

                        {/* Error Details (Development Only) */}
                        {process.env.NODE_ENV === "development" && error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-xs font-mono text-red-800 dark:text-red-300 break-all">
                                    <strong>Error:</strong> {error.message || "Unknown error"}
                                </p>
                                {error.digest && (
                                    <p className="text-xs font-mono text-red-600 dark:text-red-400 mt-2">
                                        <strong>Digest:</strong> {error.digest}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                onClick={() => reset()}
                                className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white py-6 text-base font-medium"
                            >
                                <RefreshCw className="w-5 h-5 mr-2" />
                                {t("try_again")}
                            </Button>

                            <Button
                                onClick={() => (window.location.href = "/")}
                                variant="outline"
                                className="flex-1 py-6 text-base font-medium border-gray-300 dark:border-gray-600"
                            >
                                <Home className="w-5 h-5 mr-2" />
                                {t("go_home")}
                            </Button>
                        </div>

                        {/* Support Info */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t("support_message")}{" "}
                                <a
                                    href="mailto:support@asfartrip.com"
                                    className="text-red-600 dark:text-red-400 hover:underline font-medium"
                                >
                                    support@asfartrip.com
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
