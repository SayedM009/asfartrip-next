export function getAllSegments(flight) {
    if (!flight) return [];

    if (flight.MultiLeg === "true" && Array.isArray(flight.legs)) {
        return flight.legs.flatMap((leg) => leg.segments || []);
    }

    const onward = flight?.onward?.segments || flight?.segments || [];
    const ret = flight?.return?.segments || [];
    return [...onward, ...ret];
}

export function getDuration(flight) {
    const segs = getAllSegments(flight);
    if (!segs || segs.length === 0) return 0;

    const first = segs[0];
    const last = segs[segs.length - 1];
    if (!first?.DepartureTime || !last?.ArrivalTime) return 0;

    const dep = new Date(first.DepartureTime).getTime();
    const arr = new Date(last.ArrivalTime).getTime();
    return arr - dep;
}

export function formatDuration(ms, t) {
    if (!ms || ms <= 0) return "0h 0m";

    const minutes = Math.floor(ms / 60000);
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;

    return `${h}h ${m}m`.replace("h", t("h")).replace("m", t("m"));
}
