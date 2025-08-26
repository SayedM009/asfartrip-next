import { routing } from "@/i18n/routing";
import { openSans } from "../_libs/fonts";
import { ThemeProvider } from "next-themes";
import { rootLayoutMetadata } from "../_libs/metadata";
import { NextIntlClientProvider, useLocale } from "next-intl";

import "./globals.css";
import Header from "../_components/Header";
export const metadata = rootLayoutMetadata;

// Convert all possible pages into static.
export function generateStaticParams({}) {
  return routing.locales.map((locale) => ({ locale }));
}

export default function RootLayout({ children }) {
  const locale = useLocale();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body className={`${openSans.className} `}>
        <NextIntlClientProvider>
          <ThemeProvider attribute="class" enableSystem defaultTheme="system">
            <Header />
            <main className="w-full-light-colors">{children}</main>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
