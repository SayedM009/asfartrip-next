"use client";

import { Plane } from "lucide-react";
import { useTranslations } from "next-intl";
import { Switch } from "@/components/ui/switch";

/**
 * DirectToggleRow - Direct flights only toggle
 *
 * Features:
 * - Icon + label + switch
 * - Switch always LTR (dir="ltr")
 */
export default function DirectToggleRow({ directOnly, onToggle }) {
    const t = useTranslations("Flight");

    return (
        <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
                <Switch
                    checked={directOnly}
                    onCheckedChange={onToggle}
                    dir="ltr"
                    // className="data-[state=checked]:bg-[#84E8FF] data-[state=checked]:thumb:bg-black "
                    className="data-[state=checked]:bg-accent-500 data-[state=checked]:thumb:bg-black "
                />
                <span className="text-black dark:text-white font-medium">
                    {t("direct_flights_only") || "Direct flights only"}
                </span>
            </div>
        </div>
    );
}
