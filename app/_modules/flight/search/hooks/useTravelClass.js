import { SESSION_KEYS, DEFAULT_VALUES } from "../constants/sessionKeys";
import { useSessionPersistence } from "./useSessionPersistence";

export function useTravelClass() {
    const [travelClass, setTravelClass] = useSessionPersistence(
        SESSION_KEYS.TRAVEL_CLASS,
        DEFAULT_VALUES.TRAVEL_CLASS
    );

    return { travelClass, setTravelClass };
}
