// app/_modules/flights/results/filters/utils/getSegments.js

export function getOutboundSegments(flight) {
    if (flight?.MultiLeg === "true" && flight.onward) {
        return flight.onward.segments || [];
    }
    return flight?.segments || [];
}

export function getReturnSegments(flight) {
    if (flight?.MultiLeg === "true" && flight.return) {
        return flight.return.segments || [];
    }
    return null;
}

export function getAllSegments(flight) {
    if (!flight) return [];

    // MultiLeg with multiple legs
    if (flight.MultiLeg === "true" && Array.isArray(flight.legs)) {
        return flight.legs.flatMap((leg) => leg.segments || []);
    }

    // Onward + Return
    if (flight.MultiLeg === "true" && flight.onward && flight.return) {
        return [
            ...(flight.onward?.segments || []),
            ...(flight.return?.segments || []),
        ];
    }

    // Single route
    return flight.segments || [];
}
