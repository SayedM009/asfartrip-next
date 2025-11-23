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

    if (flight.MultiLeg === "true" && Array.isArray(flight.legs)) {
        return flight.legs.flatMap((leg) => leg.segments || []);
    }

    if (flight.MultiLeg === "true" && flight.onward && flight.return) {
        return [
            ...(flight.onward?.segments || []),
            ...(flight.return?.segments || []),
        ];
    }

    return flight.segments || [];
}
