import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import TripTypeButton from "../atoms/TripTypeButton";

/**
 * TripTypeSelector - Molecule Component
 * A segmented control for selecting trip type (One Way / Round Trip)
 * Uses TripTypeButton atoms with a sliding background indicator
 * 
 * @param {string} tripType - Current selected trip type
 * @param {function} setTripType - Function to update trip type
 */
export default function TripTypeSelector({ tripType, setTripType }) {
    const { locale } = useCheckLocal();
    const t = useTranslations("Flight");

    const tripTypes = [
        { value: "oneway", label: t("one_way") },
        { value: "roundtrip", label: t("round_trip") }
    ];

    function handleTripType(type) {
        setTripType(type);
        sessionStorage.setItem("tripType", type);
    }

    // Calculate sliding background position based on locale and selected type
    const getSlidingPosition = () => {
        if (tripType === "oneway") {
            return locale === "en" ? "4px" : "calc(50% + 2px)";
        }
        if (tripType === "roundtrip") {
            return locale === "en" ? "calc(50% + 2px)" : "4px";
        }
        return "";
    };

    return (
        <div className="flex justify-start mb-4">
            <div className="relative bg-muted rounded-lg p-1">
                {/* Sliding background indicator */}
                <div
                    className="absolute top-1 bottom-1 bg-background rounded-md shadow-sm transition-all duration-300 ease-out"
                    style={{
                        left: getSlidingPosition(),
                        width: "calc(50% - 6px)",
                    }}
                    aria-hidden="true"
                />

                {/* Trip type buttons */}
                <div className="relative flex" role="group" aria-label="Trip Type Selector">
                    {tripTypes.map(({ value, label }) => (
                        <TripTypeButton
                            key={value}
                            type={value}
                            isActive={tripType === value}
                            onClick={() => handleTripType(value)}
                            label={label}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
