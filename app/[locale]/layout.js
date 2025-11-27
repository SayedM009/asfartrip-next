import { routing } from "@/i18n/routing";
import { cairo } from "@/app/_libs/fonts";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { AuthProvider } from "./providers";
import { AlertCircle } from "lucide-react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

// WhiteLabe config Context
import { getWebsiteConfig, WebsiteConfigProvider } from "../_modules/config";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }) {
    const { locale } = await params;
    const conditions = locale === "ar";
    const messages = await getMessages();
    const config = await getWebsiteConfig();

    return (
        <html
            lang={locale}
            dir={conditions ? "rtl" : "ltr"}
            suppressHydrationWarning
        >
            <body className={`${cairo.className} antialiased`}>
                <AuthProvider>
                    <WebsiteConfigProvider config={config}>
                        <NextIntlClientProvider
                            locale={locale}
                            messages={messages}
                        >
                            <ThemeProvider
                                attribute="class"
                                enableSystem
                                defaultTheme="system"
                            >
                                <main>{children}</main>
                                <Toaster
                                    position="top-center"
                                    duration={2000}
                                    icons={{
                                        success: (
                                            <CheckCircleIcon className="text-green-500 size-5" />
                                        ),
                                        error: (
                                            <AlertCircle className="rounded-full size-5 bg-red-500 text-white" />
                                        ),
                                    }}
                                />
                            </ThemeProvider>
                        </NextIntlClientProvider>
                    </WebsiteConfigProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
