// app/_modules/flights/results/filters/utils/getDurations.js
import {
    getOutboundSegments,
    getReturnSegments,
    getAllSegments,
} from "./getSegments";

export function getTotalDuration(flight) {
    const outbound = getOutboundSegments(flight);
    if (!outbound.length) return 0;

    const start = new Date(outbound[0].DepartureTime).getTime();
    const end = new Date(outbound[outbound.length - 1].ArrivalTime).getTime();
    const outboundDuration = end - start;

    const ret = getReturnSegments(flight);
    if (ret?.length) {
        const rStart = new Date(ret[0].DepartureTime).getTime();
        const rEnd = new Date(ret[ret.length - 1].ArrivalTime).getTime();
        const returnDuration = rEnd - rStart;

        return Math.max(outboundDuration, returnDuration);
    }

    return outboundDuration;
}

export function getFlightDurationHours(flight) {
    return getTotalDuration(flight) / (1000 * 60 * 60);
}

export function getStopoverDurationHours(flight) {
    const outbound = getOutboundSegments(flight);
    const ret = getReturnSegments(flight);

    let total = 0;

    if (outbound.length > 1) {
        for (let i = 1; i < outbound.length; i++) {
            const prevArrival = new Date(outbound[i - 1].ArrivalTime).getTime();
            const currDeparture = new Date(outbound[i].DepartureTime).getTime();
            total += Math.max(0, currDeparture - prevArrival);
        }
    }

    if (ret?.length > 1) {
        for (let i = 1; i < ret.length; i++) {
            const prevArrival = new Date(ret[i - 1].ArrivalTime).getTime();
            const currDeparture = new Date(ret[i].DepartureTime).getTime();
            total += Math.max(0, currDeparture - prevArrival);
        }
    }

    return total / (1000 * 60 * 60);
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

export function hasStopoverAirport(flight, code) {
    const outbound = getOutboundSegments(flight);
    const ret = getReturnSegments(flight);
    const all = [...outbound, ...(ret || [])];

    for (let i = 1; i < all.length; i++) {
        if (all[i].Origin === code) return true;
    }

    return false;
}
