import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import { CABIN_CLASSES } from "../../constants";

/**
 * ClassSelector - Molecule Component
 * Dropdown selector for cabin class (Economy, Business, First)
 * 
 * @param {string} value - Current selected class
 * @param {function} onChange - Callback when class changes
 * @param {boolean} showLabel - Whether to show label above selector
 */
export default function ClassSelector({ value, onChange, showLabel = true }) {
    const { isRTL } = useCheckLocal();
    const dir = isRTL ? "rtl" : "ltr";
    const t = useTranslations("Flight");

    const cabinOptions = [
        { value: "Economy", label: t("ticket_class.economy") },
        { value: "Business", label: t("ticket_class.business") },
        { value: "First", label: t("ticket_class.first") },
    ];

    return (
        <div>
            {showLabel && (
                <label className="block mb-2 text-sm text-muted-foreground">
                    {t("passengers.travel_class")}
                </label>
            )}
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger
                    dir={dir}
                    className="bg-input-background border-0 w-full capitalize"
                >
                    <SelectValue />
                </SelectTrigger>
                <SelectContent dir={dir}>
                    {cabinOptions.map(({ value, label }) => (
                        <SelectItem key={value} value={value} className="capitalize">
                            {label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
