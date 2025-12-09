"use client";

import WegoDateRangeDialog from "./WegoDateRangeDialog";

/**
 * WegoDateSelector - Date display with calendar picker
 *
 * Wego-style wrapper around WegoDateRangeDialog with full-row clickable area.
 */
export default function WegoDateSelector({
    tripType,
    departDate,
    range,
    onDepartDateChange,
    onRangeChange,
}) {
    return (
        <WegoDateRangeDialog
            tripType={tripType}
            departDate={departDate}
            range={range}
            onDepartDateChange={onDepartDateChange}
            onRangeDateChange={onRangeChange}
        />
    );
}
