import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { DatePicker } from "../DatePicker";

/**
 * DatePickerDialog - Organism Component
 * Mobile dialog for date selection
 * Uses the DatePicker organism internally
 * 
 * @param {boolean} open - Whether dialog is open
 * @param {function} onOpenChange - Callback when dialog open state changes
 * @param {string} tripType - Trip type ('oneway' or 'roundtrip')
 * @param {Date} departDate - Departure date
 * @param {function} setDepartDate - Set departure date
 * @param {Object} range - Date range for round-trip
 * @param {function} setRange - Set date range
 */
export default function DatePickerDialog({
    open,
    onOpenChange,
    tripType,
    departDate,
    setDepartDate,
    range,
    setRange,
}) {
    const c = useTranslations("Calender");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {tripType === "roundtrip" 
                            ? `${c("departure_date")} & ${c("return_date")}`
                            : c("departure_date")
                        }
                    </DialogTitle>
                </DialogHeader>
                <DatePicker
                    tripType={tripType}
                    departDate={departDate}
                    setDepartDate={setDepartDate}
                    range={range}
                    setRange={setRange}
                    showLabel={false}
                />
            </DialogContent>
        </Dialog>
    );
}
