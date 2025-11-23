"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PassengerClassModal } from "./PassengerClassModal";
import { User, Users, Baby, LucideLoader } from "lucide-react";
import { useTranslations } from "next-intl";
import { safeParse } from "@/app/_helpers/safeParse";
import { useRouter } from "@/i18n/navigation";

import SwapButton from "@/app/_components/ui/SwapButton";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import DateRangeDialog from "./DateRangeDialog";
import DestinationSearchDialog from "./DestinationSearchDialog";

export function FlightSearchForm({ closeModal }) {
    const [tripType, setTripType] = useState("roundtrip");
    const [departure, setDeparture] = useState("");
    const [destination, setDestination] = useState("");
    const [departDate, setDepartDate] = useState(null);
    const [range, setRange] = useState({ from: null, to: null });
    const [passengers, setPassengers] = useState({
        adults: 1,
        children: 0,
        infants: 0,
    });
    const [travelClass, setTravelClass] = useState("economy");

    const { locale } = useCheckLocal();
    const t = useTranslations("Flight");
    const router = useRouter();

    // Avoid getting sessionStorage on server to skip an error
    useEffect(() => {
        setTripType(sessionStorage.getItem("tripType") || "roundtrip");
        setDeparture(safeParse(sessionStorage.getItem("departure"), ""));
        setDestination(safeParse(sessionStorage.getItem("destination"), ""));
        setDepartDate(safeParse(sessionStorage.getItem("departureDate"), null));
        setRange(
            safeParse(sessionStorage.getItem("rangeDate"), {
                from: null,
                to: null,
            })
        );
        setTravelClass(sessionStorage.getItem("travelClass") || "economy");
        setPassengers(
            safeParse(sessionStorage.getItem("flightPassengers"), {
                adults: 1,
                children: 0,
                infants: 0,
            })
        );

        console.log(
            safeParse(sessionStorage.getItem("flightPassengers"), {
                adults: 1,
                children: 0,
                infants: 0,
            })
        );
    }, []);

    // Functions
    const swapCities = () => {
        const temp = departure;
        setDeparture(destination);
        setDestination(temp);
    };

    const getClassDisplayName = (className) => {
        switch (className) {
            case "economy":
                return "economy";
            case "business":
                return "business";
            case "first":
                return "first";
            default:
                return "economy";
        }
    };

    function handleTripType(type) {
        setTripType(type);
        sessionStorage.setItem("tripType", type);
    }

    function handleSearch() {
        if (
            departure &&
            destination &&
            departure?.label_code === destination?.label_code
        ) {
            toast.error(t("errors.same_city", { city: departure?.city }));
            return;
        }

        if (!departure) {
            toast.error(t("errors.departure_required"));
            return;
        }

        if (!destination) {
            toast.error(t("errors.destination_required"));
            return;
        }

        if (tripType === "oneway") {
            if (!departDate) {
                toast.error(t("errors.departure_date_required"));
                return;
            }
        }

        if (tripType === "roundtrip") {
            if (!range?.from || !range?.to) {
                toast.error(t("errors.return_date_required"));
                return;
            }
        }

        toast.success(t("operations.searching"), {
            icon: <LucideLoader className="size-5 animate-spin" />,
        });

        let searchObject;
        if (tripType === "oneway") {
            searchObject = {
                origin: departure.label_code,
                destination: destination.label_code,
                depart_date: format(departDate, "dd-MM-yyyy"),
                ADT: passengers.adults,
                CHD: passengers.children,
                INF: passengers.infants,
                class: travelClass,
                type: "O",
            };
        } else if (tripType === "roundtrip") {
            searchObject = {
                origin: departure.label_code,
                destination: destination.label_code,
                depart_date: format(range.from, "dd-MM-yyyy"),
                return_date: format(range.to, "dd-MM-yyyy"),
                ADT: passengers.adults,
                CHD: passengers.children,
                INF: passengers.infants,
                class: travelClass,
                type: "R",
            };
        }

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
                            <div className="relative grid grid-cols-2 h-full ">
                                <button
                                    onClick={() => handleTripType("oneway")}
                                    className={`text-sm font-semibold transition-colors duration-200 rounded-md ${
                                        tripType === "oneway"
                                            ? "text-gray-900"
                                            : "text-gray-600"
                                    }`}
                                >
                                    {t("one_way")}
                                </button>
                                <button
                                    onClick={() => handleTripType("roundtrip")}
                                    className={`text-sm font-semibold transition-colors duration-200 rounded-md ${
                                        tripType === "roundtrip"
                                            ? "text-gray-900"
                                            : "text-gray-600"
                                    }`}
                                >
                                    {t("round_trip")}
                                </button>
                                {/* Multi cities */}
                                {/* <button
                  onClick={() => setTripType("multicity")}
                  className={`text-sm font-medium transition-colors duration-200 rounded-md ${
                    tripType === "multicity" ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  Multi-city
                </button> */}
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
                                    {/* <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={swapCities}
                                        className="mx-3 h-8 w-8 rounded-full hover:bg-blue-50 border-1 border-gray-300 relative"
                                        aria-label="Switch destination values"
                                    >
                                        <RefreshCcw
                                            className={`cursor-pointer text-primary-900 transition-transform ${
                                                spinning
                                                    ? "animate-spin duration-75"
                                                    : ""
                                            }`}
                                        />
                                    </Button> */}

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

                            {/* Hidden inputs for actual functionality */}
                            <div className="sr-only">
                                <Input
                                    value={departure}
                                    onChange={(e) =>
                                        setDeparture(e.target.value)
                                    }
                                    placeholder="From"
                                />
                                <Input
                                    value={destination}
                                    onChange={(e) =>
                                        setDestination(e.target.value)
                                    }
                                    placeholder="To"
                                />
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
                                            `ticket_class.${getClassDisplayName(
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
