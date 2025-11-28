import { SESSION_KEYS, DEFAULT_VALUES } from "../constants/sessionKeys";
import { useSessionPersistence } from "./useSessionPersistence";

export function useTripType() {
    const [tripType, setTripType] = useSessionPersistence(
        SESSION_KEYS.TRIP_TYPE,
        DEFAULT_VALUES.TRIP_TYPE
    );

    return { tripType, setTripType };
}
