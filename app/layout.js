import { openSans } from "./_libs/fonts";
import { ThemeProvider } from "next-themes";
import { rootLayoutMetadata } from "./_libs/metadata";
import ThemeSwitcher from "./_components/ThemeSwitcher";
import "./globals.css";
export const metadata = rootLayoutMetadata;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${openSans.className}`}>
        <ThemeProvider attribute="class" enableSystem defaultTheme="system">
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
