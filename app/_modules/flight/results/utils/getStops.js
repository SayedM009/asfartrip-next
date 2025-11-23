// app/_modules/flights/results/filters/utils/getStops.js
import { getOutboundSegments, getReturnSegments } from "./getSegments";

export function getStops(flight) {
    const outbound = getOutboundSegments(flight);
    const returnSeg = getReturnSegments(flight);

    const outboundStops = Math.max(0, outbound.length - 1);
    const returnStops = returnSeg ? Math.max(0, returnSeg.length - 1) : 0;

    return Math.max(outboundStops, returnStops);
}
