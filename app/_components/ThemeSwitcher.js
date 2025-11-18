"use client";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
function ThemeSwitcher({ hiddenOnMobile = false }) {
    const { theme, setTheme } = useTheme();
    const condition = theme === "dark" || theme === "system";
    const t = useTranslations("ThemeSwitcher");
    function handleSwitch() {
        setTheme(condition ? "light" : "dark");
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            className={`icons-hover-600  dark:text-gray-50 font-bold  ${
                hiddenOnMobile ? "hidden sm:flex " : "flex gap-2"
            }`}
            onClick={handleSwitch}
            aria-label={t("ariaLabel")}
            title={t("title")}
        >
            <SunIcon
                className={`${
                    condition ? "block svg" : "hidden"
                } size-5 text-accent-500 sm:text-foreground`}
            />
            <MoonIcon
                className={`${
                    condition ? "hidden" : "block svg"
                } size-5 text-accent-500 sm:text-black`}
            />
            <span className="sm:hidden">{t("dark_mode")}</span>
        </Button>
    );
}

export default ThemeSwitcher;
