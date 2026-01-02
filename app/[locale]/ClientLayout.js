"use client";

import { WebsiteConfigProvider } from "../_modules/config";
import { Toaster } from "sonner";
import { AlertCircle, CheckCircleIcon } from "lucide-react";
import { useTheme } from "next-themes";

export default function ClientLayout({ children, config }) {
    const { resolvedTheme } = useTheme()
    return (
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
    );
}
