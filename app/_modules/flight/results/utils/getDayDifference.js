import { parse, differenceInCalendarDays } from "date-fns";

export const getDayDifference = (dep, arr) => {
    if (!dep || !arr) return 0;

    const depDate = dep.substring(0, 10);
    const arrDate = arr.substring(0, 10);

    const depParsed = parse(depDate, "yyyy-MM-dd", new Date());
    const arrParsed = parse(arrDate, "yyyy-MM-dd", new Date());

    return differenceInCalendarDays(arrParsed, depParsed);
};
