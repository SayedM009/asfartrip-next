"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useThemeSwitcher } from "../../hooks/useThemeSwitcher";
import { useEffect, useState } from "react";

function ThemeSwitcher({ hiddenOnMobile = false }) {
    const [mounted, setMounted] = useState(false);
    const { condition, handleSwitch } = useThemeSwitcher();
    const t = useTranslations("ThemeSwitcher");

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Button
            variant="ghost"
            size="sm"
            className={`icons-hover-600 dark:text-gray-50 font-bold ${
                hiddenOnMobile ? "hidden sm:flex" : "flex gap-2"
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
