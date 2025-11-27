import useCheckLocal from "@/app/_hooks/useCheckLocal";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";

const months = [
    { value: "1", label: "january" },
    { value: "2", label: "february" },
    { value: "3", label: "march" },
    { value: "4", label: "april" },
    { value: "5", label: "may" },
    { value: "6", label: "june" },
    { value: "7", label: "july" },
    { value: "8", label: "august" },
    { value: "9", label: "september" },
    { value: "10", label: "october" },
    { value: "11", label: "november" },
    { value: "12", label: "december" },
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
    const t = useTranslations("Months");
    const d = useTranslations("Traveler");
    const { isRTL } = useCheckLocal();
    const condition = isRTL ? "rtl" : "ltr";

    useEffect(() => {
        if (value) {
            const dateObj = typeof value === "string" ? new Date(value) : value;

            if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
                setDay(dateObj.getDate().toString());
                setMonth((dateObj.getMonth() + 1).toString());
                setYear(dateObj.getFullYear().toString());
            }
        } else {
            setDay("");
            setMonth("");
            setYear("");
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

    //  توليد السنوات بناءً على minDate و maxDate
    const getYearsRange = () => {
        const currentYear = new Date().getFullYear();
        let startYear, endYear;

        if (maxDate) {
            startYear = maxDate.getFullYear();
        } else {
            startYear = currentYear + 15;
        }

        if (minDate) {
            endYear = minDate.getFullYear();
        } else {
            endYear = 1924;
        }

        const years = [];
        for (let i = startYear; i >= endYear; i--) {
            years.push(i);
        }
        return years;
    };

    const years = getYearsRange();

    //  توليد الأيام (1-31) مع مراعاة عدد أيام الشهر
    const getDaysInMonth = (monthVal, yearVal) => {
        if (!monthVal || !yearVal) return 31;
        const daysInMonth = new Date(
            parseInt(yearVal),
            parseInt(monthVal),
            0
        ).getDate();
        return daysInMonth;
    };

    const daysCount = month && year ? getDaysInMonth(month, year) : 31;
    const days = Array.from({ length: daysCount }, (_, i) => i + 1);

    return (
        <div className="space-y-2">
            <Label className="flex items-center gap-2 ">
                {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <div className="grid grid-cols-3 gap-2">
                <div>
                    <Select value={day} onValueChange={handleDayChange}>
                        <SelectTrigger
                            dir={condition}
                            className={cn(
                                "py-6 w-full cursor-pointer",
                                error &&
                                    !day &&
                                    "border-red-500 focus:ring-red-500"
                            )}
                        >
                            <SelectValue placeholder={d("day")} />
                        </SelectTrigger>
                        <SelectContent
                            className="max-h-[200px]"
                            align="start"
                            side="bottom"
                            dir={condition}
                        >
                            {days.map((dayNum) => (
                                <SelectItem
                                    key={dayNum}
                                    value={dayNum.toString()}
                                >
                                    {String(dayNum).padStart(2, "0")}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Select value={month} onValueChange={handleMonthChange}>
                        <SelectTrigger
                            dir={condition}
                            className={cn(
                                "py-6 w-full cursor-pointer",
                                error &&
                                    !month &&
                                    "border-red-500 focus:ring-red-500"
                            )}
                        >
                            <SelectValue placeholder={d("month")} />
                        </SelectTrigger>
                        <SelectContent
                            className="max-h-[200px] rtl:text-right"
                            align="end"
                            side="bottom"
                            dir={condition}
                        >
                            {months.map((m) => (
                                <SelectItem key={m.value} value={m.value}>
                                    {t(`${m.label}`)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Select value={year} onValueChange={handleYearChange}>
                        <SelectTrigger
                            dir={condition}
                            className={cn(
                                "py-6 w-full cursor-pointer",
                                error &&
                                    !year &&
                                    "border-red-500 focus:ring-red-500"
                            )}
                        >
                            <SelectValue placeholder={d("year")} />
                        </SelectTrigger>
                        <SelectContent
                            className="max-h-[200px]"
                            align="start"
                            side="bottom"
                            dir={condition}
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
