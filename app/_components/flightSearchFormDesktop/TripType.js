import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
export default function TripType({ tripType, setTripType }) {
    const locale = useLocale();
    const t = useTranslations("Flight");
    function handleTripType(type) {
        setTripType(type);
        sessionStorage.setItem("tripType", type);
    }
    return (
        <div className="flex justify-start mb-4">
            <div className="relative bg-muted rounded-lg p-1">
                {/* Sliding background */}
                <div
                    className="absolute top-1 bottom-1 bg-background rounded-md shadow-sm transition-all duration-300 ease-out"
                    style={{
                        left:
                            tripType === "oneway"
                                ? `${
                                      locale === "en"
                                          ? "4px"
                                          : "calc(50% + 2px)"
                                  }`
                                : tripType === "roundtrip"
                                ? `${
                                      locale === "en"
                                          ? "calc(50% + 2px)"
                                          : "4px"
                                  }`
                                : "",

                        width: "calc(50% - 6px)",
                    }}
                />

                {/* Tab buttons */}
                <div className="relative flex">
                    {["oneway", "roundtrip"].map((type) => (
                        <button
                            key={type}
                            onClick={() => handleTripType(type)}
                            className={cn(
                                "px-4 py-2 font-medium transition-colors duration-200 rounded-md relative z-10 cursor-pointer",
                                tripType === type
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            {type === "oneway" ? t("one_way") : t("round_trip")}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
