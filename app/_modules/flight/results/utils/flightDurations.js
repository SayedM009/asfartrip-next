// app/_modules/flights/results/utils/flightDurations.js

import {
    getOutboundSegments,
    getReturnSegments,
    getAllSegments,
} from "./flightSegmentation";

export function getTotalDuration(flight) {
    const outbound = getOutboundSegments(flight);
    if (!outbound.length) return 0;

    const outboundStart = new Date(outbound[0].DepartureTime).getTime();
    const outboundEnd = new Date(
        outbound[outbound.length - 1].ArrivalTime
    ).getTime();
    const outboundDuration = outboundEnd - outboundStart;

    const ret = getReturnSegments(flight);
    if (ret?.length) {
        const retStart = new Date(ret[0].DepartureTime).getTime();
        const retEnd = new Date(ret[ret.length - 1].ArrivalTime).getTime();
        const returnDuration = retEnd - retStart;

        // نرجّع أطول مدة بين الذهاب والعودة
        return Math.max(outboundDuration, returnDuration);
    }

    return outboundDuration;
}

export function getStopsCount(flight) {
    const outboundStops = Math.max(0, getOutboundSegments(flight).length - 1);

    const returnSegments = getReturnSegments(flight);
    const returnStops = returnSegments
        ? Math.max(0, returnSegments.length - 1)
        : 0;

    return Math.max(outboundStops, returnStops);
}

export function getStopoverDurationHours(flight) {
    const outboundSegments = getOutboundSegments(flight);
    const returnSegments = getReturnSegments(flight);

    let totalStopoverMs = 0;

    if (outboundSegments && outboundSegments.length > 1) {
        for (let i = 1; i < outboundSegments.length; i++) {
            const prevArrival = new Date(
                outboundSegments[i - 1].ArrivalTime
            ).getTime();
            const currDeparture = new Date(
                outboundSegments[i].DepartureTime
            ).getTime();
            totalStopoverMs += Math.max(0, currDeparture - prevArrival);
        }
    }

    if (returnSegments && returnSegments.length > 1) {
        for (let i = 1; i < returnSegments.length; i++) {
            const prevArrival = new Date(
                returnSegments[i - 1].ArrivalTime
            ).getTime();
            const currDeparture = new Date(
                returnSegments[i].DepartureTime
            ).getTime();
            totalStopoverMs += Math.max(0, currDeparture - prevArrival);
        }
    }

    return totalStopoverMs / (1000 * 60 * 60);
}

export function getFlightDurationHours(flight) {
    const durationMs = getTotalDuration(flight);
    return durationMs / (1000 * 60 * 60);
}

export function hasStopoverAirport(flight, airportCode) {
    const segments = getOutboundSegments(flight);
    const returnSegments = getReturnSegments(flight);
    const allSegments = [...segments, ...(returnSegments || [])];

    // Check intermediate airports (not first departure or last arrival)
    for (let i = 1; i < allSegments.length; i++) {
        if (allSegments[i].Origin === airportCode) {
            return true;
        }
    }
    return false;
}

export function getDurationMs(flight) {
    const segs = getAllSegments(flight);
    if (!segs.length) return Infinity;
    const first = segs[0];
    const last = segs[segs.length - 1];
    if (!first?.DepartureTime || !last?.ArrivalTime) return Infinity;
    return (
        new Date(last.ArrivalTime).getTime() -
        new Date(first.DepartureTime).getTime()
    );
}
