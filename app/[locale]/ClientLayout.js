
"use client";

import { Component } from "react";
import { WebsiteConfigProvider } from "../_modules/config";
import { Toaster } from "sonner";
import { AlertCircle, CheckCircleIcon } from "lucide-react";
import { useTheme } from "next-themes";


class ClientErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.group("🔴 CLIENT ERROR BOUNDARY CAUGHT:");
        console.error("Error:", error);
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);
        console.error("Component Stack:", errorInfo.componentStack);
        console.groupEnd();

        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError && this.state.error) {
            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-red-50 dark:bg-gray-900">
                    <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
                        {/* Header */}
                        <div className="flex items-start gap-4 mb-6">
                            <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full flex-shrink-0">
                                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    An error occurred in the application
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    An unexpected error was detected. Please review the details below.
                                </p>
                            </div>
                        </div>

                        {/* Error Details */}
                        <div className="space-y-4">
                            {/* Error Message */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Error Message:
                                </h3>
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                    <p className="font-mono text-sm text-red-800 dark:text-red-300 break-words">
                                        {this.state.error.message}
                                    </p>
                                </div>
                            </div>

                            {/* Stack Trace (Development Only) */}
                            {process.env.NODE_ENV === "development" && (
                                <>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            📍 Stack Trace:
                                        </h3>
                                        <div className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4 max-h-48 overflow-auto">
                                            <pre className="font-mono text-xs text-gray-800 dark:text-gray-300 whitespace-pre-wrap">
                                                {this.state.error.stack}
                                            </pre>
                                        </div>
                                    </div>

                                    {this.state.errorInfo && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                🧩 Component Stack:
                                            </h3>
                                            <div className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4 max-h-48 overflow-auto">
                                                <pre className="font-mono text-xs text-gray-800 dark:text-gray-300 whitespace-pre-wrap">
                                                    {this.state.errorInfo.componentStack}
                                                </pre>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() =>
                                    this.setState({
                                        hasError: false,
                                        error: null,
                                        errorInfo: null,
                                    })
                                }
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                Retry
                            </button>
                            <button
                                onClick={() => (window.location.href = "/")}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                Home Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}


export default function ClientLayout({ children, config }) {
    const { resolvedTheme } = useTheme();

    return (
        <ClientErrorBoundary>
            <WebsiteConfigProvider config={config}>
                <Toaster
                    position="top-center"
                    duration={2000}
                    icons={{
                        success: <CheckCircleIcon className="text-green-500 size-5" />,
                        error: (
                            <AlertCircle className="rounded-full size-5 bg-red-500 text-white" />
                        ),
                    }}
                    theme={resolvedTheme}
                />
                <main>{children}</main>
            </WebsiteConfigProvider>
        </ClientErrorBoundary>
    );
}