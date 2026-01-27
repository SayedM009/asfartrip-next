"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { SORT_OPTIONS } from "../../constants/sortOptions";

/**
 * Sort select dropdown for desktop
 * @param {Object} props
 * @param {string} props.value - Current sort value
 * @param {Function} props.onChange - Callback when sort changes
 */
export default function SortSelect({ value, onChange }) {
    const t = useTranslations("Hotels.results");

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder={t("sort_by")} />
            </SelectTrigger>
            <SelectContent>
                {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {t(option.labelKey)}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
