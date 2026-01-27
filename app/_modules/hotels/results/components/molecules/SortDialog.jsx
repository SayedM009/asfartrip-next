"use client";

import { useTranslations } from "next-intl";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Check } from "lucide-react";
import { SORT_OPTIONS } from "../../constants/sortOptions";

/**
 * Mobile sort dialog (full-screen)
 * @param {Object} props
 * @param {string} props.value - Current sort value
 * @param {Function} props.onChange - Callback when sort changes
 */
export default function SortDialog({ value, onChange }) {
    const t = useTranslations("Hotels.results");

    const handleSelect = (sortValue) => {
        onChange?.(sortValue);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 flex-1 font-bold"
                >
                    <ArrowUpDown className="size-4" />
                    {t("sort")}
                </Button>
            </DialogTrigger>
            <DialogContent
                className="max-w-none  rounded-lg p-0 gap-0 w-[90vw] overflow-hidden"
                showCloseButton={false}
            >
                <DialogHeader className="p-4 border-b sticky top-0 bg-background z-999">
                    <div className="flex items-center justify-between">
                        <DialogTitle>{t("sort_by")}</DialogTitle>
                        <DialogClose asChild>
                            <Button variant="ghost" size="sm" className="w-fit">
                                {t("cancel")}
                            </Button>
                        </DialogClose>
                    </div>
                </DialogHeader>

                <div className="p-4 space-y-2">
                    {SORT_OPTIONS.map((option) => (
                        <DialogClose asChild key={option.value}>
                            <button
                                onClick={() => handleSelect(option.value)}
                                className={`w-full flex items-center justify-between px-4 py-2 rounded-lg border transition-colors ${
                                    value === option.value
                                        ? "border-accent-500 bg-accent-50 dark:bg-accent-900/20"
                                        : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
                                }`}
                            >
                                <span className="font-medium">
                                    {t(option.labelKey)}
                                </span>
                                {value === option.value && (
                                    <Check className="size-5 text-accent-500" />
                                )}
                            </button>
                        </DialogClose>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
