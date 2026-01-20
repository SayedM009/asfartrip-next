"use client";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CHILD_AGE_MIN, CHILD_AGE_MAX } from "../../constants/guestLimits";

/**
 * Age selector for a single child
 * @param {Object} props
 * @param {number} props.index - Child index (0-based)
 * @param {number} props.age - Current age
 * @param {Function} props.onChange - Callback with new age
 * @param {Function} props.t - Translation function
 */
export default function ChildAgeSelector({ index, age, onChange, t }) {
    const ageOptions = Array.from(
        { length: CHILD_AGE_MAX - CHILD_AGE_MIN + 1 },
        (_, i) => i + CHILD_AGE_MIN,
    );

    return (
        <div className="flex items-center gap-2">
            <Label className="text-xs whitespace-nowrap">
                {t("child")} {index + 1}
            </Label>
            <Select
                value={String(age)}
                onValueChange={(value) => onChange(parseInt(value))}
            >
                <SelectTrigger className="flex-1 h-8">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {ageOptions.map((ageOption) => (
                        <SelectItem key={ageOption} value={String(ageOption)}>
                            {ageOption} {t("years")}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
