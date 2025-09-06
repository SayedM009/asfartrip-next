import { routing } from "@/i18n/routing";
import { cairo, ibm, ibmSans, openSans } from "@/app/_libs/fonts";
import { ThemeProvider } from "next-themes";
import { rootLayoutMetadata } from "@/app/_libs/metadata";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import "@/app/[locale]/globals.css";
import Navbar from "@/app/_components/Navbar";
import ServicesNavigation from "@/app/_components/ServicesNavigation";

export const metadata = rootLayoutMetadata;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params: { locale } }) {
  const conditions = locale === "ar";

  // جلب الـ messages
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={conditions ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body className={`${conditions ? ibm.className : ibmSans.className} `}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" enableSystem defaultTheme="system">
            <Navbar />
            <ServicesNavigation />
            <main className="w-full-light-colors">{children}</main>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
