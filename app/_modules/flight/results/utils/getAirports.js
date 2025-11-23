// app/_modules/flights/results/filters/utils/getAirports.js
import { getOutboundSegments, getReturnSegments } from "./getSegments";

export function getAirports(flights) {
    const map = {};

    flights.forEach((f) => {
        const segs = getOutboundSegments(f);
        const ret = getReturnSegments(f);
        const all = [...segs, ...(ret || [])];

        for (let i = 1; i < all.length; i++) {
            const airport = all[i].Origin;
            if (airport) {
                map[airport] = (map[airport] || 0) + 1;
            }
        }
    });

    return Object.entries(map).sort((a, b) => b[1] - a[1]);
}
