import { Button } from "@/components/ui/button";
import { ChevronDown, Users } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslations } from "next-intl";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import PassengerSelector from "../molecules/PassengerSelector";
import ClassSelector from "../molecules/ClassSelector";
import {
    applyPassengerRules,
} from "../../logic/applyPassengerRules";

/**
 * PassengerClassPicker - Organism Component
 * Complete passenger and class selection interface with popover
 * Combines PassengerSelector and ClassSelector molecules
 * 
 * @param {Object} passengers - Current passenger counts
 * @param {function} setPassengers - Function to update passengers
 * @param {string} travelClass - Current travel class
 * @param {function} setTravelClass - Function to update travel class
 * @param {boolean} showLabel - Whether to show label above button
 */
export default function PassengerClassPicker({
    passengers,
    setPassengers,
    travelClass,
    setTravelClass,
    showLabel = true,
}) {
    const { locale } = useCheckLocal();
    const t = useTranslations("Flight");
    
    const totalPassengers =
        passengers.adults + passengers.children + passengers.infants;

    const getClassDisplayName = (className) => {
        switch (className) {
            case "Economy":
                return "economy";
            case "Business":
                return "business";
            case "First":
                return "first";
            default:
                return "economy";
        }
    };

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

            // Apply passenger rules
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

    const handleTravelClass = (value) => {
        setTravelClass(value);
        sessionStorage.setItem("travelClass", value);
    };

    return (
        <div className="flex-1">
            {showLabel && (
                <label className="block mb-2 text-muted-foreground text-xs">
                    {t("passengers.passengers")} &{" "}
                    {t("passengers.travel_class")}
                </label>
            )}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="h-12 w-full justify-between bg-input-background border-0 cursor-pointer"
                    >
                        <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium capitalize">
                                {totalPassengers}{" "}
                                {totalPassengers === 1 
                                    ? t("passengers.passenger") 
                                    : t("passengers.passengers")}
                                | {t(`ticket_class.${getClassDisplayName(travelClass)}`)}
                            </span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-80 p-4 mt-1"
                    align="end"
                    side="bottom"
                >
                    <div className="space-y-4">
                        {/* Class Selection */}
                        <ClassSelector
                            value={travelClass}
                            onChange={handleTravelClass}
                        />

                        {/* Passenger Selection */}
                        <PassengerSelector
                            passengers={passengers}
                            onUpdate={updatePassengers}
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
