import { format } from "date-fns";

/**
 * Build search object for flight search API
 * Unified logic for both desktop and mobile
 */
export function buildFlightSearchObject({
    tripType,
    departure,
    destination,
    departDate,
    range,
    passengers,
    travelClass,
}) {
    const baseObject = {
        origin: departure.label_code,
        destination: destination.label_code,
        ADT: passengers.adults,
        CHD: passengers.children,
        INF: passengers.infants,
        class: travelClass,
    };

    if (tripType === "oneway") {
        return {
            ...baseObject,
            depart_date: format(departDate, "dd-MM-yyyy"),
            type: "O",
        };
    } else if (tripType === "roundtrip") {
        return {
            ...baseObject,
            depart_date: format(range.from, "dd-MM-yyyy"),
            return_date: format(range.to, "dd-MM-yyyy"),
            type: "R",
        };
    }

    return baseObject;
}
