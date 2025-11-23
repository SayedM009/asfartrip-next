import { useTranslations } from "next-intl";
import { Baby, User, Users } from "lucide-react";
import { PassengerCounter, PassengerTypeRow } from "../atoms";
import {
    canAddPassenger,
    canRemovePassenger,
} from "../../logic/applyPassengerRules";

/**
 * PassengerSelector - Molecule Component
 * Complete passenger selection interface with counters for adults, children, and infants
 * 
 * @param {Object} passengers - Current passenger counts { adults, children, infants }
 * @param {function} onUpdate - Callback when passenger count changes
 */
export default function PassengerSelector({ passengers, onUpdate }) {
    const t = useTranslations("Flight");

    const passengerConfig = [
        {
            key: "adults",
            label: t("passengers.adults"),
            description: t("passengers.adults_description"),
            icon: User,
        },
        {
            key: "children",
            label: t("passengers.children"),
            description: t("passengers.children_description"),
            icon: Users,
        },
        {
            key: "infants",
            label: t("passengers.infants"),
            description: t("passengers.infants_description"),
            icon: Baby,
        },
    ];

    const handleUpdate = (type, increment) => {
        onUpdate(type, increment);
    };

    return (
        <div className="space-y-3">
            {passengerConfig.map(({ key, label, description, icon }) => (
                <PassengerTypeRow
                    key={key}
                    icon={icon}
                    label={label}
                    description={description}
                >
                    <PassengerCounter
                        value={passengers[key]}
                        onIncrement={() => handleUpdate(key, true)}
                        onDecrement={() => handleUpdate(key, false)}
                        canIncrement={canAddPassenger(key, passengers)}
                        canDecrement={canRemovePassenger(key, passengers)}
                        label={label}
                    />
                </PassengerTypeRow>
            ))}
        </div>
    );
}
