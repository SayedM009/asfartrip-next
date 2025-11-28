import { SESSION_KEYS, DEFAULT_VALUES } from "../constants/sessionKeys";
import { useSessionPersistence } from "./useSessionPersistence";
import { applyPassengerRules } from "../logic/applyPassengerRules";

export function usePassengerLogic() {
    const [passengers, setPassengers] = useSessionPersistence(
        SESSION_KEYS.PASSENGERS,
        DEFAULT_VALUES.PASSENGERS
    );

    const updatePassengers = (type, increment) => {
        const currentCount = passengers[type];
        const newCount = increment ? currentCount + 1 : Math.max(0, currentCount - 1);

        let updated = { ...passengers, [type]: newCount };

        // Apply rules
        updated = applyPassengerRules({
            ADT: updated.adults,
            CHD: updated.children,
            INF: updated.infants
        });

        setPassengers(updated);
    };

    return { passengers, setPassengers, updatePassengers };
}
