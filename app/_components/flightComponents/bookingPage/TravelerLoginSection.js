import React from "react";
import { Gift } from "lucide-react";
import AuthDialog from "../../loginButton/AuthDialog";
import { useTranslations } from "next-intl";
export default function TravelerLoginSection() {
    const t = useTranslations("Login");
    return (
        <div className="bg-gradient-to-r from-accent-50 to-accent-100 dark:from-accent-100 dark:to-accent-200 rounded-lg border border-accent-200 dark:border-accent-800 p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4">
                    <div className="bg-accent-200 dark:bg-accent-300 p-3 rounded-lg shrink-0">
                        <Gift className="w-6 h-6 text-accent-600 dark:text-accent-100" />
                    </div>
                    <div>
                        <h3 className="mb-2 rtl:text-right font-semibold dark:text-black">
                            {t("have_account")}
                        </h3>
                        <p className="text-sm text-muted-foreground rtl:text-right">
                            {t("sign_in_helper")}
                        </p>
                    </div>
                </div>
                <AuthDialog primary={true} />
            </div>
        </div>
    );
}
