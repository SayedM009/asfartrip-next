"use client";
import { AlertCircle } from "lucide-react";
import ChevronBasedOnLanguage from "@/app/_components/ui/ChevronBasedOnLanguage";
import { useAirportTranslation } from "@/app/_hooks/useAirportTranslation";

export default function FlightOverview({
    t,
    outboundSegments,
    returnSegments,
    isRoundTrip,
    departureCity,
    destinationCity,
    firstSegment,
    lastSegment,
    formatDate,
    calculateTotalDuration,
    formatPrice,
    TotalPrice,
}) {
    const { getCityName } = useAirportTranslation();
    
    // Get translated city names from airport codes
    const translatedDepartureCity = getCityName(firstSegment.Origin) || departureCity;
    const translatedDestinationCity = getCityName(lastSegment.Destination) || destinationCity;
    
    return (
        <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="font-semibold flex items-center gap-2 capitalize">
                        {translatedDepartureCity}
                        <ChevronBasedOnLanguage icon="arrow" />
                        {translatedDestinationCity}

                        {isRoundTrip && (
                            <span className="ml-2 text-sm font-normal">
                                {t("round_trip")}
                            </span>
                        )}
                    </h3>

                    {/* Dates */}
                    <p className="text-sm text-muted-foreground">
                        {t("departure")}:{" "}
                        {formatDate(firstSegment.DepartureTime, {
                            pattern: "EEEE, d MMMM , yyyy",
                        })}
                        {isRoundTrip && returnSegments && (
                            <span className="block mt-1">
                                {t("filters.return")}:{" "}
                                {formatDate(returnSegments[0].DepartureTime, {
                                    pattern: "EEEE, d MMMM , yyyy",
                                })}
                            </span>
                        )}
                        {/* Duration */}
                        <div className="text-sm mt-2 text-muted-foreground">
                            {isRoundTrip
                                ? t("dialog.total_round_trip")
                                : `${t(
                                      "dialog.journey"
                                  )}: ${calculateTotalDuration(
                                      outboundSegments,
                                      t
                                  )}`}
                        </div>
                    </p>
                </div>

                <div className="text-right">
                    <div className="text-sm font-bold text-accent-400">
                        {formatPrice(TotalPrice)}
                    </div>
                </div>
            </div>

            {/* Visa Warning */}
            {(outboundSegments.length > 1 ||
                (returnSegments && returnSegments.length > 1)) && (
                <div className="flex items-center gap-2 text-xs mt-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span>{t("dialog.check_visa")}</span>
                </div>
            )}
        </div>
    );
}
