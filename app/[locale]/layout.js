import { routing } from "@/i18n/routing";
import { ibm, ibmSans } from "@/app/_libs/fonts";
import { ThemeProvider } from "next-themes";
import { rootLayoutMetadata } from "@/app/_libs/metadata";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { AuthProvider } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "../_components/Footer";
import "@/app/[locale]/globals.css";

export const metadata = rootLayoutMetadata;

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params: { locale } }) {
    const conditions = locale === "ar";
    const messages = await getMessages();

    return (
        <html
            lang={locale}
            dir={conditions ? "rtl" : "ltr"}
            suppressHydrationWarning
        >
            <body
                className={`${
                    conditions ? ibm.className : ibmSans.className
                }  `}
            >
                <AuthProvider>
                    <NextIntlClientProvider locale={locale} messages={messages}>
                        <ThemeProvider
                            attribute="class"
                            enableSystem
                            defaultTheme="system"
                        >
                            <main className="container-custom min-h-screen ">
                                {children}
                            </main>
                            <Footer />
                            <Toaster position="top-center" />
                        </ThemeProvider>
                    </NextIntlClientProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
