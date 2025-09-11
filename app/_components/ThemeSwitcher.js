"use client";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
function ThemeSwitcher({ hiddenOnMobile = false }) {
  const { theme, setTheme } = useTheme();
  const condition = theme === "dark";
  const t = useTranslations("ThemeSwitcher");
  function handleSwitch() {
    setTheme(condition ? "light" : "dark");
  }
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`icons-hover-600  md:px-2 md:py-1.5 dark:text-gray-50 font-bold ${
        hiddenOnMobile ? "hidden sm:flex " : "flex gap-1"
      }`}
      onClick={handleSwitch}
      aria-label={t("ariaLabel")}
      title={t("title")}
    >
      <SunIcon className={`${condition ? "block svg" : "hidden"} `} />
      <MoonIcon className={`${condition ? "hidden" : "block svg"}`} />
      <span>{t("dark_mode")}</span>
    </Button>
  );
}

export default ThemeSwitcher;
