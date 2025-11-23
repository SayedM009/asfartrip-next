import { parseISO, differenceInMinutes } from "date-fns";

export const calculateLayover = (arrival, nextDeparture) => {
    const a = parseISO(arrival);
    const d = parseISO(nextDeparture);
    const mins = differenceInMinutes(d, a);

    return {
        hours: Math.floor(mins / 60),
        minutes: mins % 60,
        text: `${Math.floor(mins / 60)}h ${mins % 60}m`,
    };
};

export const calculateTotalLayover = (segments, t) => {
    if (segments.length <= 1) return "";

    let total = 0;

    for (let i = 0; i < segments.length - 1; i++) {
        const a = parseISO(segments[i].ArrivalTime);
        const d = parseISO(segments[i + 1].DepartureTime);
        total += differenceInMinutes(d, a);
    }

    const h = Math.floor(total / 60);
    const m = total % 60;

    return `${h}h ${m}m`.replace("h", t("h")).replace("m", t("m"));
};
