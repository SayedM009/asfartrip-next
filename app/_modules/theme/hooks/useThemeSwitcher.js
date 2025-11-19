"use client";

import { useTheme } from "next-themes";

export function useThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    const condition = theme === "dark" || theme === "system";

    const handleSwitch = () => {
        setTheme(condition ? "light" : "dark");
    };

    return {
        condition,
        handleSwitch,
    };
}
