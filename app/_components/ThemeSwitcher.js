"use client";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const condition = theme === "dark";
  const t = useTranslations("ThemeSwitcher");
  function handleSwitch() {
    setTheme(condition ? "light" : "dark");
  }
  return (
    <button
      className="icons-hover-600"
      onClick={handleSwitch}
      aria-label={t("ariaLabel")}
      title={t("title")}
    >
      <SunIcon className={`${condition ? "block" : "hidden"} `} />
      <MoonIcon className={`${condition ? "hidden" : "block"}`} />
    </button>
  );
}

export default ThemeSwitcher;
