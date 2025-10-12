import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import React, { useState, useEffect } from "react";

const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
];

export function DateDropdownFields({
    label,
    value,
    onChange,
    minDate,
    maxDate,
    required = false,
    error = false,
    id,
}) {
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    useEffect(() => {
        if (value) {
            setDay(value.getDate().toString());
            setMonth((value.getMonth() + 1).toString());
            setYear(value.getFullYear().toString());
        }
    }, [value]);

    const handleDateChange = (newDay, newMonth, newYear) => {
        if (newDay && newMonth && newYear) {
            const date = new Date(
                parseInt(newYear),
                parseInt(newMonth) - 1,
                parseInt(newDay)
            );
            onChange?.(date);
        } else {
            onChange?.(undefined);
        }
    };

    const handleDayChange = (val) => {
        setDay(val);
        handleDateChange(val, month, year);
    };

    const handleMonthChange = (val) => {
        setMonth(val);
        handleDateChange(day, val, year);
    };

    const handleYearChange = (val) => {
        setYear(val);
        handleDateChange(day, month, val);
    };

    // Generate years based on minDate and maxDate
    const currentYear = new Date().getFullYear();
    const startYear = maxDate ? maxDate.getFullYear() : currentYear + 15;
    const endYear = minDate ? minDate.getFullYear() : 1924;

    const years = [];
    for (let i = startYear; i >= endYear; i--) {
        years.push(i);
    }

    // Generate days (1-31)
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
        <div className="space-y-2">
            <Label className="flex items-center gap-2 rtl:justify-end">
                {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <div className="grid grid-cols-3 gap-2">
                <div>
                    <Select value={day} onValueChange={handleDayChange}>
                        <SelectTrigger
                            className={cn(
                                "py-6 w-full",
                                error &&
                                    !day &&
                                    "border-red-500 focus:ring-red-500"
                            )}
                        >
                            <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent
                            className="max-h-[200px]"
                            align="start"
                            side="bottom"
                        >
                            {days.map((d) => (
                                <SelectItem key={d} value={d.toString()}>
                                    {String(d).padStart(2, "0")}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Select value={month} onValueChange={handleMonthChange}>
                        <SelectTrigger
                            className={cn(
                                "py-6 w-full",
                                error &&
                                    !month &&
                                    "border-red-500 focus:ring-red-500"
                            )}
                        >
                            <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent
                            className="max-h-[200px]"
                            align="start"
                            side="bottom"
                        >
                            {months.map((m) => (
                                <SelectItem key={m.value} value={m.value}>
                                    {m.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Select value={year} onValueChange={handleYearChange}>
                        <SelectTrigger
                            className={cn(
                                "py-6 w-full",
                                error &&
                                    !year &&
                                    "border-red-500 focus:ring-red-500"
                            )}
                        >
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent
                            className="max-h-[200px]"
                            align="start"
                            side="bottom"
                        >
                            {years.map((y) => (
                                <SelectItem key={y} value={y.toString()}>
                                    {y}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
