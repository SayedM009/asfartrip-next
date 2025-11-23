"use client";

import { Gift } from "lucide-react";
import { useTranslations } from "next-intl";
import { AuthDialog } from "@/app/_modules/auth";

export default function TravelerLoginSection() {
    const t = useTranslations("Login");

    return (
        <div className="bg-gradient-to-r from-accent-50 to-accent-100 dark:from-accent-100 dark:to-accent-200 rounded-lg border border-accent-200 dark:border-accent-800 p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
                {/* Left Section */}
                <div className="flex items-start gap-4">
                    <div className="bg-accent-200 dark:bg-accent-300 p-3 rounded-lg shrink-0">
                        <Gift className="w-6 h-6 text-accent-600 dark:text-accent-100" />
                    </div>

                    <div className="space-y-1 rtl:text-right">
                        <h3 className="font-semibold dark:text-black">
                            {t("have_account")}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                            {t("sign_in_helper")}
                        </p>
                    </div>
                </div>

                {/* Right Section — Login Button */}
                <AuthDialog primary />
            </div>
        </div>
    );
}
