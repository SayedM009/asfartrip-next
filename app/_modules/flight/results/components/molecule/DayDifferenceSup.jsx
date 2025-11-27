import { getDayDifference } from "../../utils/getDayDifference";

export const DayDifferenceSup = ({ dep, arr }) => {
    console.log(dep, arr);
    const diff = getDayDifference(dep, arr);

    if (diff <= 0) return null;

    return (
        <sup className="text-xs text-destructive ml-1">
            +{diff}
        </sup>
    );
};
