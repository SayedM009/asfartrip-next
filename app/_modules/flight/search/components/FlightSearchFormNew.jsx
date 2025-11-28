"use client";
import React from "react";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";

// ✨ NEW: Import new atomic components
import TripTypeSelector from "./molecules/TripTypeSelector";
import PassengerClassPicker from "./organisms/PassengerClassPicker";
import DatePicker from "./organisms/DatePicker";
import MainSearchForm from "./desktop/MainSearchForm"; // Keep this for now (destinations)

// ✅ NEW: Import shared hooks (same as old components)
import { useTripType } from "../hooks/useTripType";
import { useDateSelection } from "../hooks/useDateSelection";
import { usePassengerLogic } from "../hooks/usePassengerLogic";
import { useTravelClass } from "../hooks/useTravelClass";
import { useSearchValidation } from "../hooks/useSearchValidation";
import { useSessionPersistence } from "../hooks/useSessionPersistence";
import { SESSION_KEYS } from "../constants/sessionKeys";
import { buildFlightSearchObject } from "../utils/buildSearchObject";

/**
 * FlightSearchFormNew - NEW VERSION (FIXED)
 * Uses the new atomic design components + shared hooks architecture
 * This is a drop-in replacement for FlightSearchFormDesktop
 * UI: 100% identical, Logic: Uses shared hooks
 */
export default function FlightSearchFormNew({ isLabel = true }) {
    const t = useTranslations("Flight");
    const router = useRouter();

    // =============================
    // ✅ FIXED: Use Shared Hooks (same as old components)
    // =============================
    const { tripType, setTripType } = useTripType();
    const { departDate, setDepartDate, range, setRange } = useDateSelection();
    const { passengers, setPassengers } = usePassengerLogic();
    const { travelClass, setTravelClass } = useTravelClass();
    const { validateSearch } = useSearchValidation();

    // Airport state - unified default as empty object
    const [departure, setDeparture] = useSessionPersistence(SESSION_KEYS.DEPARTURE, {});
    const [destination, setDestination] = useSessionPersistence(SESSION_KEYS.DESTINATION, {});

    // =============================
    // ✅ FIXED: Use Shared Search Handler
    // =============================
    async function handleSearch() {
        const isValid = validateSearch({
            departure,
            destination,
            tripType,
            departDate,
            range,
            passengers
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
        router.push(`/flights/search?${params.toString()}`);
    }

    return (
        <div className="bg-background">
            <div>
                <div className=" mx-auto">
                    {/* Search Form */}
                    <Card className="border shadow-sm">
                        <CardContent className="p-4">
                            {/* ✨ NEW: Trip Type Selector (Atomic) */}
                            <TripTypeSelector
                                tripType={tripType}
                                onChange={setTripType}
                            />

                            {/* Main Search Form - All fields on one line */}
                            <div className="flex gap-3 items-end flex-wrap">
                                {/* ✨ Keep old MainSearchForm for now (destinations) */}
                                <MainSearchForm
                                    departure={departure}
                                    setDeparture={setDeparture}
                                    destination={destination}
                                    setDestination={setDestination}
                                    isLabel={isLabel}
                                />

                                {/* ✨ NEW: Date Picker (Atomic) */}
                                <DatePicker
                                    tripType={tripType}
                                    departDate={departDate}
                                    onDepartDateChange={setDepartDate}
                                    range={range}
                                    onRangeDateChange={setRange}
                                    isLabel={isLabel}
                                />

                                {/* ✨ NEW: Passengers & Class (Atomic) */}
                                <PassengerClassPicker
                                    passengers={passengers}
                                    onPassengersChange={setPassengers}
                                    travelClass={travelClass}
                                    onClassChange={setTravelClass}
                                    isLabel={isLabel}
                                />

                                {/* Search Button - Redesigned */}
                                <div className="flex-shrink-0">
                                    <Button
                                        className="h-12 lg:ps-6 lg:pe-8 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer gap-2"
                                        onClick={handleSearch}
                                    >
                                        <Search className="mr-2 h-5 w-5" />
                                        {t("operations.search")}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
