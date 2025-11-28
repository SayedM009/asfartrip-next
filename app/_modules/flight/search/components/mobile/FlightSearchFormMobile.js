"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PassengerClassModal } from "./PassengerClassModal";
import { User, Users, Baby, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";

import SwapButton from "@/app/_components/ui/SwapButton";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import DateRangeDialog from "./DateRangeDialog";
import DestinationSearchDialog from "./DestinationSearchDialog";

// Shared Logic Hooks
import { useTripType } from "../../hooks/useTripType";
import { useDateSelection } from "../../hooks/useDateSelection";
import { usePassengerLogic } from "../../hooks/usePassengerLogic";
import { useTravelClass } from "../../hooks/useTravelClass";
import { useSearchValidation } from "../../hooks/useSearchValidation";
import { useSessionPersistence } from "../../hooks/useSessionPersistence";
import { SESSION_KEYS } from "../../constants/sessionKeys";
import { buildFlightSearchObject } from "../../utils/buildSearchObject";
import { normalizeClassName } from "../../utils/formatters";

export function FlightSearchForm({ closeModal }) {
    const { locale } = useCheckLocal();
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

    // Functions
    const swapCities = () => {
        const temp = departure;
        setDeparture(destination);
        setDestination(temp);
    };

    function handleSearch() {
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
        closeModal?.(false);
    }

    return (
        <div className=" from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 mt-5  ">
            <div className="max-w-md mx-auto">
                {/* Main Search Card */}
                <Card className="shadow-lg ">
                    <CardContent className="px-4 space-y-2 py-0">
                        {/* Trip Type Tabs with Sliding Animation */}
                        <div className="relative  bg-secondary-200 dark:bg-input-background/5 rounded-lg p-1 h-10">
                            {/* Sliding background */}
                            <div
                                className="absolute top-1 bottom-1 bg-white  rounded-md shadow-sm transition-all duration-300 ease-out"
                                style={{
                                    left:
                                        tripType === "oneway"
                                            ? `${locale === "en"
                                                ? "4px"
                                                : "calc(50% + 2px)"
                                            }`
                                            : tripType === "roundtrip"
                                                ? `${locale === "en"
                                                    ? "calc(50% + 2px)"
                                                    : "4px"
                                                }`
                                                : "",

                                    width: "calc(50% - 6px)",
                                }}
                            />

                            {/* Tab buttons */}
                            <div className="relative grid grid-cols-2 h-full ">
                                <button
                                    onClick={() => setTripType("oneway")}
                                    className={`text-sm font-semibold transition-colors duration-200 rounded-md ${tripType === "oneway"
                                        ? "text-gray-900"
                                        : "text-gray-600"
                                        }`}
                                >
                                    {t("one_way")}
                                </button>
                                <button
                                    onClick={() => setTripType("roundtrip")}
                                    className={`text-sm font-semibold transition-colors duration-200 rounded-md ${tripType === "roundtrip"
                                        ? "text-gray-900"
                                        : "text-gray-600"
                                        }`}
                                >
                                    {t("round_trip")}
                                </button>
                            </div>
                        </div>

                        {/* Cities Section */}
                        <div className="m-0">
                            {/* From and To with Swap Button */}
                            <div className="relative">
                                <div className="flex items-center justify-between py-2">
                                    {/* From City - Clickable */}
                                    <DestinationSearchDialog
                                        destination={departure}
                                        onSelect={setDeparture}
                                        locale={locale}
                                        sessionKey="departure"
                                    />

                                    {/* Swap Button */}
                                    <SwapButton callBack={swapCities} />

                                    {/* To City - Clickable */}
                                    <DestinationSearchDialog
                                        destination={destination}
                                        onSelect={setDestination}
                                        locale={locale}
                                        dir="end"
                                        sessionKey="destination"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Date Section - Clickable */}
                        <DateRangeDialog
                            tripType={tripType}
                            departDate={departDate}
                            range={range}
                            onDepartDateChange={setDepartDate}
                            onRangeDateChange={setRange}
                        />

                        {/* Class and Passengers - Clickable */}
                        <PassengerClassModal
                            passengers={passengers}
                            travelClass={travelClass}
                            onPassengersChange={setPassengers}
                            onClassChange={setTravelClass}
                        >
                            <Button
                                className="flex w-full items-center justify-between py-3 border-t border-gray-200 cursor-pointer hover:bg-gray-50 rounded transition-colors p-0"
                                variant="ghost"
                            >
                                <div className="flex-1 flex justify-start">
                                    <div className="text-sm  font-semibold capitalize">
                                        {t(
                                            `ticket_class.${normalizeClassName(
                                                travelClass
                                            )}`
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    {/* Adults */}
                                    <div className="flex items-center space-x-1">
                                        <User className="h-4 w-4 " />
                                        <span className="text-sm font-medium ">
                                            {passengers.adults}
                                        </span>
                                    </div>
                                    {/* Children */}
                                    <div className="flex items-center space-x-1">
                                        <Users className="h-4 w-4 " />
                                        <span className="text-sm font-medium ">
                                            {passengers.children}
                                        </span>
                                    </div>
                                    {/* Infants */}
                                    <div className="flex items-center space-x-1">
                                        <Baby className="h-4 w-4 " />
                                        <span className="text-sm font-medium ">
                                            {passengers.infants}
                                        </span>
                                    </div>
                                </div>
                            </Button>
                        </PassengerClassModal>

                        {/* Search Button */}
                        <Button className="btn-primary" onClick={handleSearch}>
                            {t("operations.search")}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
