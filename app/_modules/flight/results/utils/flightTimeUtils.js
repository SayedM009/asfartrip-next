// app/_modules/flights/results/utils/flightTimeUtils.js

import { format, parseISO, differenceInMinutes } from "date-fns";

/**
 * Format ISO date string to specific time pattern
 * default: "HH:mm"
 */
export function formatTime(isoString, pattern = "HH:mm") {
    if (!isoString) return "";
    try {
        return format(parseISO(isoString), pattern);
    } catch {
        return "";
    }
}

/**
 * Calculate total duration of a journey from segments array
 * returns localized string like: "5h 30m" → "5س 30د" حسب t("h") و t("m")
 */
export function calculateTotalDuration(segmentsArray = [], t) {
    if (!segmentsArray || segmentsArray.length === 0) return "";

    const departure = parseISO(segmentsArray[0].DepartureTime);
    const arrival = parseISO(
        segmentsArray[segmentsArray.length - 1].ArrivalTime
    );

    const totalMinutes = differenceInMinutes(arrival, departure);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`
        .replace("h", t?.("h") ?? "h")
        .replace("m", t?.("m") ?? "m");
}

/**
 * Calculate layover time between two ISO date strings
 * returns localized string "Xh Ym"
 */
export function calculateLayoverTime(arrivalTime, nextDepartureTime, t) {
    if (!arrivalTime || !nextDepartureTime) return "";

    const arrival = parseISO(arrivalTime);
    const departure = parseISO(nextDepartureTime);
    const layoverMinutes = differenceInMinutes(departure, arrival);

    const hours = Math.floor(layoverMinutes / 60);
    const minutes = layoverMinutes % 60;

    return `${hours}h ${minutes}m`
        .replace("h", t?.("h") ?? "h")
        .replace("m", t?.("m") ?? "m");
}

/**
 * Format segment duration that comes as "HH:MM" or "HH:MM:SS"
 * to localized "Xh Ym"
 */
export function formatSegmentDuration(duration, t) {
    if (!duration) return "";

    // duration like "05:30" or "05:30:00"
    const parts = String(duration).split(":");
    const hours = parts[0] ?? "0";
    const minutes = parts[1] ?? "0";

    return `${hours}h ${minutes}m`
        .replace("h", t?.("h") ?? "h")
        .replace("m", t?.("m") ?? "m");
}
