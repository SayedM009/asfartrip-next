import { format, parseISO, differenceInMinutes } from "date-fns";

export const formatTime = (time) => time.substring(11, 16);


export const calculateTotalDuration = (segments, t) => {
    const departure = parseISO(segments[0].DepartureTime);
    const arrival = parseISO(segments[segments.length - 1].ArrivalTime);

    const total = differenceInMinutes(arrival, departure);
    const h = Math.floor(total / 60);
    const m = total % 60;

    return `${h}h ${m}m`.replace("h", t("h")).replace("m", t("m"));
};
