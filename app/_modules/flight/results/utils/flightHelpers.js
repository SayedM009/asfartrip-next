import { parseISO } from "date-fns";

export const getAirlineLogo = (code) =>
    `https://images.kiwi.com/airlines/64x64/${code}.png`;

export const isNextDay = (dep, arr) => {
    const d = parseISO(dep);
    const a = parseISO(arr);
    return a.getDate() !== d.getDate();
};
