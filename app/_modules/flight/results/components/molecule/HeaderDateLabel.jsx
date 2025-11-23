"use client";

export default function HeaderDateLabel({
    departDate,
    returnDate,
    formatDate,
    pattern,
}) {
    return (
        <span className="text-xs whitespace-nowrap">
            {departDate ? formatDate(departDate, { pattern }) : "—"}
            {returnDate ? ` - ${formatDate(returnDate, { pattern })}` : ""}
        </span>
    );
}
