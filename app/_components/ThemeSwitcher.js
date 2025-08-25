"use client";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const condition = theme === "dark";
  function handleSwitch() {
    setTheme(condition ? "light" : "dark");
  }
  return (
    <button
      className="border-1 cursor-pointer p-1 rounded-full"
      onClick={handleSwitch}
    >
      {condition ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

export default ThemeSwitcher;
