import { routing } from "@/i18n/routing";
import { cairo, ibmSans } from "@/app/_libs/fonts";
import { ThemeProvider } from "next-themes";
import { rootLayoutMetadata } from "@/app/_libs/metadata";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { AuthProvider } from "./providers";
import { CurrencyProvider } from "../_context/CurrencyContext";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export const metadata = rootLayoutMetadata;

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }) {
    const { locale } = await params;
    const conditions = locale === "ar";
    const messages = await getMessages();

    return (
        <html
            lang={locale}
            dir={conditions ? "rtl" : "ltr"}
            suppressHydrationWarning
        >
            <body
                // className={`${
                //     conditions ? cairo.className : ibmSans.className
                // }  `}
                className={`${cairo.className}`}
            >
                <AuthProvider>
                    <CurrencyProvider baseCurrency="AED">
                        <NextIntlClientProvider
                            locale={locale}
                            messages={messages}
                        >
                            <ThemeProvider
                                attribute="class"
                                enableSystem
                                defaultTheme="system"
                            >
                                {/* <main className="container-custom min-h-screen "> */}
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
                    </CurrencyProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
