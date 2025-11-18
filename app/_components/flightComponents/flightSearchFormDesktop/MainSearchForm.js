"use client";
import { useState } from "react";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { MapPin, Plane } from "lucide-react";
import { useTranslations } from "next-intl";
import { searchAirports } from "@/app/_libs/flightService";
import SwapButton from "@/app/_components/ui/SwapButton";
import DestinationsContent from "./DestinationsContent";

// ========================
// Popular Destinations Data
// ========================
const popularDestinationsGCC = [
    {
        label_code: "DXB",
        city: "Dubai",
        country: "United Arab Emirates",
        airport: "Dubai International Airport",
    },
    {
        label_code: "AUH",
        city: "Abu Dhabi",
        country: "United Arab Emirates",
        airport: "Zayed International Airport",
    },
    {
        label_code: "SHJ",
        city: "Sharjah",
        country: "United Arab Emirates",
        airport: "Sharjah International Airport",
    },
    {
        label_code: "DOH",
        city: "Doha",
        country: "Qatar",
        airport: "Hamad International Airport",
    },
    {
        label_code: "BAH",
        city: "Manama",
        country: "Bahrain",
        airport: "Bahrain International Airport",
    },
    {
        label_code: "RUH",
        city: "Riyadh",
        country: "Saudi Arabia",
        airport: "King Khalid International Airport",
    },
    {
        label_code: "JED",
        city: "Jeddah",
        country: "Saudi Arabia",
        airport: "King Abdulaziz International Airport",
    },
    {
        label_code: "DMM",
        city: "Dammam",
        country: "Saudi Arabia",
        airport: "King Fahd International Airport",
    },
    {
        label_code: "MCT",
        city: "Muscat",
        country: "Oman",
        airport: "Muscat International Airport",
    },
    {
        label_code: "KWI",
        city: "Kuwait City",
        country: "Kuwait",
        airport: "Kuwait International Airport",
    },
];

const popularInternationalDestinations = [
    {
        label_code: "CAI",
        city: "Cairo",
        country: "Egypt",
        airport: "Cairo International Airport",
    },
    {
        label_code: "IST",
        city: "Istanbul",
        country: "Turkey",
        airport: "Istanbul Airport",
    },
    {
        label_code: "BOM",
        city: "Mumbai",
        country: "India",
        airport: "Chhatrapati Shivaji International Airport",
    },
    {
        label_code: "LHR",
        city: "London",
        country: "United Kingdom",
        airport: "Heathrow Airport",
    },
    {
        label_code: "MNL",
        city: "Manila",
        country: "Philippines",
        airport: "Ninoy Aquino International Airport",
    },
    {
        label_code: "LHE",
        city: "Lahore",
        country: "Pakistan",
        airport: "Allama Iqbal International Airport",
    },
    {
        label_code: "CMB",
        city: "Colombo",
        country: "Sri Lanka",
        airport: "Bandaranaike International Airport",
    },
    {
        label_code: "KTM",
        city: "Kathmandu",
        country: "Nepal",
        airport: "Tribhuvan International Airport",
    },
    {
        label_code: "DAC",
        city: "Dhaka",
        country: "Bangladesh",
        airport: "Hazrat Shahjalal International Airport",
    },
    {
        label_code: "SIN",
        city: "Singapore",
        country: "Singapore",
        airport: "Changi Airport",
    },
];

// ========================
// Main Component
// ========================
export default function MainSearchForm({
    departure,
    setDeparture,
    destination,
    setDestination,
    isLabel,
}) {
    const [showDestinationResults, setShowDestinationResults] = useState(false);
    const [showDepartureResults, setShowDepartureResults] = useState(false);
    const [isSearchingDeparture, setIsSearchingDeparture] = useState(false);
    const [isSearchingDestination, setIsSearchingDestination] = useState(false);
    const [departureSearch, setDepartureSearch] = useState("");
    const [destinationSearch, setDestinationSearch] = useState("");
    const [departureResults, setDepartureResults] = useState([]);
    const [destinationResults, setDestinationResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const t = useTranslations("Flight");

    // ========================
    // Search Handler
    // ========================
    const handleSearch = async (value, onSearch, onResults) => {
        onSearch(value);

        if (value && value.length > 2) {
            try {
                setIsLoading(true);
                onResults([]); // clear old results first
                const data = await searchAirports(value);

                // Filter invalid / incomplete results
                const validResults = data.filter(
                    (d) =>
                        d.label_code?.length === 3 &&
                        d.city &&
                        d.country &&
                        !d.city.toLowerCase().includes("test")
                );

                onResults(validResults);
            } catch (error) {
                console.error("Error searching airports:", error);
                onResults([]);
            } finally {
                setIsLoading(false);
            }
        } else {
            onResults([]);
        }
    };

    // ========================
    // Swap Function
    // ========================
    const swapCities = () => {
        const temp = departure;
        setDeparture(destination);
        setDestination(temp);
    };

    return (
        <>
            {/* Departure */}
            <div className="flex-1">
                {isLabel && (
                    <label className="block mb-2 text-muted-foreground text-sm">
                        {t("from")}
                    </label>
                )}
                <Popover
                    open={showDepartureResults}
                    onOpenChange={setShowDepartureResults}
                >
                    <PopoverTrigger asChild>
                        <div
                            className="relative cursor-pointer hover:bg-input-background/5 transition-colors min-w-30"
                            onClick={() => {
                                setIsSearchingDeparture(true);
                                setShowDepartureResults(true);
                            }}
                        >
                            {isSearchingDeparture ? (
                                <Input
                                    value={departureSearch}
                                    onChange={(e) =>
                                        handleSearch(
                                            e.target.value,
                                            setDepartureSearch,
                                            setDepartureResults
                                        )
                                    }
                                    placeholder={t(
                                        "operations.departure_search"
                                    )}
                                    className="h-12 pl-10 border-0 rtl:pr-10"
                                    autoFocus
                                    onBlur={(e) => {
                                        if (
                                            !e.relatedTarget?.closest(
                                                '[role="option"]'
                                            )
                                        ) {
                                            setTimeout(() => {
                                                setIsSearchingDeparture(false);
                                                setDepartureSearch("");
                                                setShowDepartureResults(false);
                                            }, 100);
                                        }
                                    }}
                                />
                            ) : (
                                <div className="h-12 bg-input-background dark:bg-input-background/5 rounded-md border-0 rtl:pr-10 py-2 pl-10 flex items-center">
                                    <span className="font-medium text-foreground capitalize">
                                        {departure.city ||
                                            t("operations.departure_search")}
                                    </span>
                                </div>
                            )}
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:right-3" />
                        </div>
                    </PopoverTrigger>
                    <DestinationsContent
                        search={departureSearch}
                        results={departureResults}
                        onDestination={setDeparture}
                        onSearch={setDepartureSearch}
                        onShowResults={setShowDepartureResults}
                        onIsSearching={setIsSearchingDeparture}
                        popularDestinations={popularDestinationsGCC}
                        sessionKey="departure"
                        isLoading={isLoading}
                    />
                </Popover>
            </div>

            {/* Swap */}
            <div className="flex justify-center items-center mb-2">
                <SwapButton callBack={swapCities} />
            </div>

            {/* Destination */}
            <div className="flex-1">
                {isLabel && (
                    <label className="block mb-2 text-muted-foreground text-sm">
                        {t("to")}
                    </label>
                )}
                <Popover
                    open={showDestinationResults}
                    onOpenChange={setShowDestinationResults}
                >
                    <PopoverTrigger asChild>
                        <div
                            className="relative cursor-pointer hover:bg-input-background/5 transition-colors min-w-30"
                            onClick={() => {
                                setIsSearchingDestination(true);
                                setShowDestinationResults(true);
                            }}
                        >
                            {isSearchingDestination ? (
                                <Input
                                    value={destinationSearch}
                                    onChange={(e) =>
                                        handleSearch(
                                            e.target.value,
                                            setDestinationSearch,
                                            setDestinationResults
                                        )
                                    }
                                    placeholder={t(
                                        "operations.destination_search"
                                    )}
                                    className="h-12 pl-10 bg-input-background border-0 rtl:pr-10"
                                    autoFocus
                                    onBlur={(e) => {
                                        if (
                                            !e.relatedTarget?.closest(
                                                '[role="option"]'
                                            )
                                        ) {
                                            setTimeout(() => {
                                                setIsSearchingDestination(
                                                    false
                                                );
                                                setDestinationSearch("");
                                                setShowDestinationResults(
                                                    false
                                                );
                                            }, 100);
                                        }
                                    }}
                                />
                            ) : (
                                <div className="h-12 bg-input-background dark:bg-input-background/5 rounded-md border-0 rtl:pr-10 py-2 pl-10 flex items-center">
                                    <span className="font-medium text-foreground capitalize">
                                        {destination.city ||
                                            t("operations.destination_search")}
                                    </span>
                                </div>
                            )}
                            <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:right-3" />
                        </div>
                    </PopoverTrigger>
                    <DestinationsContent
                        search={destinationSearch}
                        results={destinationResults}
                        onDestination={setDestination}
                        onSearch={setDestinationSearch}
                        onShowResults={setShowDestinationResults}
                        onIsSearching={setIsSearchingDestination}
                        popularDestinations={popularInternationalDestinations}
                        sessionKey="destination"
                        isLoading={isLoading}
                    />
                </Popover>
            </div>
        </>
    );
}
