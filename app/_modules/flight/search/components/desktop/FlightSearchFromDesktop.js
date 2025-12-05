"use client";
import React from "react";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";

import TripType from "./TripType";
import MainSearchForm from "./MainSearchForm";
import Dates from "./Date";
import PassengersAndClass from "./PassengersAndClass";

// Shared Logic Hooks
import { useTripType } from "../../hooks/useTripType";
import { useDateSelection } from "../../hooks/useDateSelection";
import { usePassengerLogic } from "../../hooks/usePassengerLogic";
import { useTravelClass } from "../../hooks/useTravelClass";
import { useSearchValidation } from "../../hooks/useSearchValidation";
import { useSessionPersistence } from "../../hooks/useSessionPersistence";
import { SESSION_KEYS } from "../../constants/sessionKeys";
import { buildFlightSearchObject } from "../../utils/buildSearchObject";

export function FlightSearchFormDesktop({ isLabel = true }) {
    const t = useTranslations("Flight");
    const router = useRouter();

    // Unified State Hooks
    const { tripType, setTripType } = useTripType();
    const { departDate, setDepartDate, range, setRange } = useDateSelection();
    const { passengers, setPassengers } = usePassengerLogic();
    const { travelClass, setTravelClass } = useTravelClass();
    const { validateSearch } = useSearchValidation();

    // Airport state - unified default as empty object
    const [departure, setDeparture] = useSessionPersistence(SESSION_KEYS.DEPARTURE, {});
    const [destination, setDestination] = useSessionPersistence(SESSION_KEYS.DESTINATION, {});

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
                    <Card className="border shadow-sm py-4">
                        <CardContent className="p-4">
                            {/* Trip Type Selection - Left Aligned */}
                            <TripType
                                tripType={tripType}
                                setTripType={setTripType}
                            />
                            {/* Main Search Form - All fields on one line */}
                            <div className="flex gap-3 items-end flex-wrap">
                                <MainSearchForm
                                    departure={departure}
                                    setDeparture={setDeparture}
                                    destination={destination}
                                    setDestination={setDestination}
                                    isLabel={isLabel}
                                />
                                {/* Dates - Combined for Round Trip */}
                                <Dates
                                    tripType={tripType}
                                    departDate={departDate}
                                    setDepartDate={setDepartDate}
                                    range={range}
                                    setRange={setRange}
                                    isLabel={isLabel}
                                />
                                {/* Passengers & Class */}
                                <PassengersAndClass
                                    passengers={passengers}
                                    setPassengers={setPassengers}
                                    travelClass={travelClass}
                                    setTravelClass={setTravelClass}
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
