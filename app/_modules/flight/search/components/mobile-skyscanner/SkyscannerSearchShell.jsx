"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
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
import TripTypeTabs from "./TripTypeTabs";
import RouteCard from "./RouteCard";
import DateSelectorRow from "./DateSelectorRow";
import PassengersRow from "./PassengersRow";
import DirectToggleRow from "./DirectToggleRow";
import FloatingSearchCTA from "./FloatingSearchCTA";

import useCheckLocal from "@/app/_hooks/useCheckLocal";

/**
 * SkyscannerSearchShell - Main container orchestrating all hooks
 * Skyscanner-style mobile flight search form
 */
export default function SkyscannerSearchShell({ onSearchComplete }) {
    const { locale } = useCheckLocal();
    const t = useTranslations("Flight");
    const router = useRouter();

    // UI-only state
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

    // Check if search is valid (for CTA button state)
    const isSearchValid = !!(departure?.label_code && destination?.label_code);

    /**
     * handleSearch - using existing validation and search logic
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

        if (directOnly) {
            params.set("direct", "true");
        }

        router.push(`/flights/search?${params.toString()}`);
        onSearchComplete?.();
    }

    return (
        <div className=" flex flex-col space-y-2">
            {/* Trip Type Tabs - Skyscanner style */}
            <TripTypeTabs tripType={tripType} onTripTypeChange={setTripType} />

            {/* Route Card (From/To with swap) */}
            <RouteCard
                departure={departure}
                destination={destination}
                onDepartureChange={setDeparture}
                onDestinationChange={setDestination}
                onSwap={swapCities}
                locale={locale}
            />

            {/* Date Selector Row */}
            <DateSelectorRow
                tripType={tripType}
                departDate={departDate}
                range={range}
                onDepartDateChange={setDepartDate}
                onRangeChange={setRange}
            />
            {/* Passengers & Class Row */}
            <PassengersRow
                passengers={passengers}
                travelClass={travelClass}
                onPassengersChange={setPassengers}
                onClassChange={setTravelClass}
            />

            <div className="flex items-center justify-between">
                {/* Direct Flights Toggle */}
                <DirectToggleRow
                    directOnly={directOnly}
                    onToggle={setDirectOnly}
                />

                {/* Floating Search CTA */}
                <FloatingSearchCTA
                    onSearch={handleSearch}
                    isValid={isSearchValid}
                />
            </div>
        </div>
    );
}
