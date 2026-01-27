"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Filter, RefreshCw } from "lucide-react";

/**
 * No filter results component (when filters return no matches)
 * @param {Object} props
 * @param {Function} props.onReset - Reset filters callback
 */
export default function NoFilterResults({ onReset }) {
    const t = useTranslations("Hotels.results");

    return (
        <div className="text-center py-12 px-4">
            <div className="inline-flex items-center justify-center size-16 bg-orange-100 dark:bg-orange-900/20 rounded-full mb-4">
                <Filter className="size-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
                {t("no_filter_results")}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                {t("no_filter_results_desc")}
            </p>
            <Button variant="outline" onClick={onReset} className="gap-2">
                <RefreshCw className="size-4" />
                {t("clear_filters")}
            </Button>
        </div>
    );
}
