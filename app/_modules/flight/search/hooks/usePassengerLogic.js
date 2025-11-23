import { useState } from "react";
import { applyPassengerRules } from "../logic/applyPassengerRules";

/**
 * usePassengerLogic - Custom Hook
 * Manages passenger state and validation logic
 * 
 * @param {Object} initialPassengers - Initial passenger counts
 * @returns {Object} Passenger state and update functions
 */
export function usePassengerLogic(initialPassengers = { adults: 1, children: 0, infants: 0 }) {
    const [passengers, setPassengers] = useState(initialPassengers);

    const updatePassengers = (type, increment) => {
        setPassengers((prev) => {
            // Calculate new value
            let newValue = increment
                ? prev[type] + 1
                : Math.max(0, prev[type] - 1);

            // Create updated object
            let updated = {
                ...prev,
                [type]: newValue,
            };

            // Apply passenger rules (e.g., infants can't exceed adults)
            updated = applyPassengerRules({
                ADT: updated.adults,
                CHD: updated.children,
                INF: updated.infants,
            });

            // Save to sessionStorage
            sessionStorage.setItem("flightPassengers", JSON.stringify(updated));

            return updated;
        });
    };

    const getTotalPassengers = () => {
        return passengers.adults + passengers.children + passengers.infants;
    };

    const resetPassengers = () => {
        const defaultPassengers = { adults: 1, children: 0, infants: 0 };
        setPassengers(defaultPassengers);
        sessionStorage.setItem("flightPassengers", JSON.stringify(defaultPassengers));
    };

    return {
        passengers,
        setPassengers,
        updatePassengers,
        getTotalPassengers,
        resetPassengers,
    };
}
