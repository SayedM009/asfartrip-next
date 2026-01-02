import { routing } from "@/i18n/routing";
import { cairo } from "@/app/_libs/fonts";
import { getMessages } from "next-intl/server";
import { getWebsiteConfig } from "../_modules/config/api/getWebsiteConfig";
import ClientLayout from "./ClientLayout";
import "./globals.css";
import { AuthProvider } from "./providers";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { AlertCircle, CheckCircleIcon } from "lucide-react";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }) {
    const locale = (await params)?.locale || "en";
    const messages = await getMessages({ locale });

    const isRTL = locale === "ar";
    const config = await getWebsiteConfig();



    return (
        <html lang={locale} dir={isRTL ? "rtl" : "ltr"} suppressHydrationWarning>
            <body className={`${cairo.className} antialiased`}>
                <AuthProvider>
                    <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Dubai">
                        <ThemeProvider attribute="class" enableSystem defaultTheme="light">
                            <ClientLayout config={config}>
                                {children}
                            </ClientLayout>
                            <Toaster
                                position="top-center"
                                duration={2000}
                                icons={{
                                    success: <CheckCircleIcon className="text-green-500 size-5" />,
                                    error: (
                                        <AlertCircle className="rounded-full size-5 bg-red-500 text-white" />
                                    ),
                                }}
                            />
                        </ThemeProvider>
                    </NextIntlClientProvider>
                </AuthProvider>

            </body>
        </html>
    );
}
