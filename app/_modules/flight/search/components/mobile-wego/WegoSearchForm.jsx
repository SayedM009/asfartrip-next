"use client";

import { useState } from "react";
import { Loader2, Plane } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";

// Existing hooks (100% reuse)
import { useTripType } from "../../hooks/useTripType";
import { useDateSelection } from "../../hooks/useDateSelection";
import { usePassengerLogic } from "../../hooks/usePassengerLogic";
import { useTravelClass } from "../../hooks/useTravelClass";
import { useSearchValidation } from "../../hooks/useSearchValidation";
import { useSessionPersistence } from "../../hooks/useSessionPersistence";
import { SESSION_KEYS } from "../../constants/sessionKeys";

// Existing utils (100% reuse)
import { buildFlightSearchObject } from "../../utils/buildSearchObject";

// Sub-components
import WegoTripTypeTabs from "./WegoTripTypeTabs";

import useCheckLocal from "@/app/_hooks/useCheckLocal";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import WegoPassengerSelector from "./WegoPassengerSelector";
import WegoDateSelector from "./WegoDateSelector";
import WegoLocationSelector from "./WegoLocationSelector";

/**
 * WegoSearchForm - Main form container with Wego-style layout
 * Matches the Wego screenshots exactly.
 */
export default function WegoSearchForm({ onSearchComplete }) {
    const { locale } = useCheckLocal();
    const t = useTranslations("Flight");
    const router = useRouter();

    // Direct flights only toggle
    const [directOnly, setDirectOnly] = useState(false);

    // Unified State Hooks (100% reuse)
    const { tripType, setTripType } = useTripType();
    const { departDate, setDepartDate, range, setRange } = useDateSelection();
    const { passengers, setPassengers } = usePassengerLogic();
    const { travelClass, setTravelClass } = useTravelClass();
    const { validateSearch } = useSearchValidation();

    // Airport state
    const [departure, setDeparture] = useSessionPersistence(
        SESSION_KEYS.DEPARTURE,
        {}
    );
    const [destination, setDestination] = useSessionPersistence(
        SESSION_KEYS.DESTINATION,
        {}
    );

    // Swap cities function
    const swapCities = () => {
        const temp = departure;
        setDeparture(destination);
        setDestination(temp);
    };

    // Get total passengers
    // const totalPassengers =
    //     passengers.adults + passengers.children + passengers.infants;

    /**
     * handleSearch - EXACT COPY of approved reference logic
     * With direct=true added to URL when directOnly is enabled
     */
    function handleSearch() {
        const isValid = validateSearch({
            departure,
            destination,
            tripType,
            departDate,
            range,
            passengers,
        });

        if (!isValid) return;

        toast.success(t("operations.searching"), {
            icon: <Loader2 className="size-5 animate-spin" />,
        });

        const searchObject = buildFlightSearchObject({
            tripType,
            departure,
            destination,
            departDate,
            range,
            passengers,
            travelClass,
        });

        const params = new URLSearchParams();
        params.set("searchObject", JSON.stringify(searchObject));
        params.set("cities", JSON.stringify({ departure, destination }));

        // Add direct=true to URL when toggle is enabled
        if (directOnly) {
            params.set("direct", "true");
        }

        router.push(`/flights/search?${params.toString()}`);
        onSearchComplete?.();
    }

    return (
        <>
            {/* Trip Type Tabs - Pill Style */}
            <WegoTripTypeTabs
                tripType={tripType}
                onTripTypeChange={setTripType}
            />
            <div className="rounded-xl border border-border my-6">
                {/* From/To Card */}
                <WegoLocationSelector
                    departure={departure}
                    destination={destination}
                    onDepartureChange={setDeparture}
                    onDestinationChange={setDestination}
                    onSwap={swapCities}
                    locale={locale}
                />

                {/* Date Card */}
                <div className="bg-background border-y border-gray-200 dark:border-gray-700 py-3 px-2">
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <WegoDateSelector
                                tripType={tripType}
                                departDate={departDate}
                                range={range}
                                onDepartDateChange={setDepartDate}
                                onRangeChange={setRange}
                            />
                        </div>
                    </div>
                </div>

                {/* Passengers & Class Card */}
                <div className="bg-background border-b border-gray-200 dark:border-gray-700 p-2">
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <WegoPassengerSelector
                                passengers={passengers}
                                travelClass={travelClass}
                                onPassengersChange={setPassengers}
                                onClassChange={setTravelClass}
                            />
                        </div>
                    </div>
                </div>

                {/* Direct Flights Only Toggle */}
                <div className="flex items-center justify-between py-3 px-3 my-3">
                    <div className="flex items-center gap-3">
                        <Plane className="w-5 h-5 rotate-45 dark:text-white" />
                        <span className="text-md text-black dark:text-white font-bold">
                            {t("direct_flights_only")}
                        </span>
                    </div>
                    <Switch
                        checked={directOnly}
                        onCheckedChange={setDirectOnly}
                        dir="ltr"
                    />
                </div>
            </div>
            {/* Search Button */}
            <Button
                onClick={handleSearch}
                disabled={!departure?.label_code || !destination?.label_code}
                className="w-full h-12 bg-accent-500 hover:bg-accent-600 text-white font-bold text-base rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                {t("operations.search")}
            </Button>
        </>
    );
}
