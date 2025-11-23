// app/_modules/flights/results/filters/utils/getAirlines.js
import { getOutboundSegments, getReturnSegments } from "./getSegments";

export function getAirlines(flights) {
    const map = {};

    flights.forEach((f) => {
        const segs = getOutboundSegments(f);
        const ret = getReturnSegments(f);
        const all = [...segs, ...(ret || [])];

        all.forEach((s) => {
            if (s.Carrier) {
                map[s.Carrier] = (map[s.Carrier] || 0) + 1;
            }
        });
    });

    return Object.entries(map).sort((a, b) => b[1] - a[1]);
}
