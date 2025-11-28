import { SESSION_KEYS } from "../constants/sessionKeys";
import { useSessionPersistence } from "./useSessionPersistence";

export function useDateSelection() {
    const [departDate, setDepartDate] = useSessionPersistence(
        SESSION_KEYS.DEPARTURE_DATE,
        null
    );

    const [range, setRange] = useSessionPersistence(
        SESSION_KEYS.RANGE_DATE,
        { from: null, to: null }
    );

    return {
        departDate,
        setDepartDate,
        range,
        setRange
    };
}
