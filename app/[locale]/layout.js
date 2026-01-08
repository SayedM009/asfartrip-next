import { routing } from "@/i18n/routing";
import { cairo } from "@/app/_libs/fonts";
import { getMessages } from "next-intl/server";
import { getWebsiteConfig } from "../_modules/config/api/getWebsiteConfig";
import { AuthProvider } from "./providers";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import ClientLayout from "./ClientLayout";
import "./globals.css";


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
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, interactive-widget=resizes-content" />
            </head>
            <body className={`${cairo.className} antialiased`}>
                <AuthProvider>
                    <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Dubai">
                        <ThemeProvider attribute="class" enableSystem defaultTheme="light">
                            <ClientLayout config={config}>
                                {children}
                            </ClientLayout>
                        </ThemeProvider>
                    </NextIntlClientProvider>
                </AuthProvider>

            </body>
        </html>
    );
}
