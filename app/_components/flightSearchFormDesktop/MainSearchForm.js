"use client";
import { useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Plane } from "lucide-react";
import { useTranslations } from "next-intl";
import { searchAirports } from "@/app/_libs/flightService";
import SwapButton from "../SwapButton";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import SpinnerMini from "../SpinnerMini";

// Popular destinations data
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
        airport:
            "Zayed International Airport (formerly Abu Dhabi International)",
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

    const handleSearch = async (value, onSearch, onResults) => {
        onSearch(value);

        if (value && value.length > 2) {
            try {
                setIsLoading(true);
                const data = await searchAirports(value);
                onResults(data);
            } catch (error) {
                console.error("Error searching destination airports:", error);
                onResults([]);
            } finally {
                setIsLoading(false);
            }
        } else {
            onResults([]);
        }
    };

    const swapCities = () => {
        const temp = departure;
        setDeparture(destination);
        setDestination(temp);
    };

    return (
        <>
            {" "}
            {/* From City */}
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
                            role={!isSearchingDeparture ? "button" : undefined}
                            tabIndex={!isSearchingDeparture ? 0 : undefined}
                            aria-label={
                                !isSearchingDeparture
                                    ? `Selected departure city: ${
                                          departure.city ||
                                          t("operations.departure_search")
                                      }`
                                    : undefined
                            }
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
                                    className="h-12 pl-10 border-0"
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
                                    aria-label="Search departure city"
                                />
                            ) : (
                                <div className="h-12 bg-input-background dark:bg-input-background/5 rounded-md border-0 px-3 py-2 pl-10 flex items-center">
                                    <span className="font-medium text-foreground capitalize">
                                        {departure.city ||
                                            t("operations.departure_search")}
                                    </span>
                                </div>
                            )}

                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
            {/* Swap Button */}
            <div className="flex justify-center items-center mb-2">
                <SwapButton callBack={swapCities} />
            </div>
            {/* To City */}
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
                            role={
                                !isSearchingDestination ? "button" : undefined
                            }
                            tabIndex={!isSearchingDestination ? 0 : undefined}
                            aria-label={
                                !isSearchingDestination
                                    ? `Selected destination city: ${
                                          destination.city ||
                                          t("operations.destination_search")
                                      }`
                                    : undefined
                            }
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
                                    className="h-12 pl-10 bg-input-background border-0"
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
                                    aria-label="Search destination city"
                                />
                            ) : (
                                <div className="h-12 bg-input-background dark:bg-input-background/5 rounded-md border-0 px-3 py-2 pl-10 flex items-center">
                                    <span className="font-medium text-foreground capitalize">
                                        {destination.city ||
                                            t("operations.destination_search")}
                                    </span>
                                </div>
                            )}

                            <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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

function DestinationsContent({
    search,
    results,
    onDestination,
    onSearch,
    onShowResults,
    onIsSearching,
    popularDestinations = popularDestinationsGCC,
    sessionKey,
    isLoading = false, // <--- نضيف prop جديد
}) {
    const fillteredObj = search
        ? results
        : popularDestinations.filter(
              (dest) =>
                  dest.city.toLowerCase().includes(search.toLowerCase()) ||
                  dest.label_code
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                  dest.country.toLowerCase().includes(search.toLowerCase())
          );
    const { locale, isRTL } = useCheckLocal();
    const dir = isRTL ? "rtl" : "ltr";
    const t = useTranslations("Flight");

    const handleSelect = (dest) => {
        onDestination(dest);
        onSearch("");
        onShowResults(false);
        onIsSearching(false);
        sessionStorage.setItem(
            sessionKey,
            JSON.stringify({
                city: dest.city,
                label_code: dest.label_code,
                country: dest.country,
                airport: dest.airport,
            })
        );
    };

    return (
        <PopoverContent
            className="w-80 p-0 mt-1"
            align="start"
            side="bottom"
            onOpenAutoFocus={(e) => e.preventDefault()}
        >
            <ScrollArea className="h-64 " dir={dir}>
                <div className="p-1">
                    {search ? (
                        isLoading ? (
                            <div className="p-4 text-center flex items-center justify-center h-56">
                                <SpinnerMini />
                            </div>
                        ) : fillteredObj.length > 0 ? (
                            fillteredObj.map((dest) => (
                                <button
                                    key={dest.label_code}
                                    onClick={() => handleSelect(dest)}
                                    className="w-full p-3 text-left hover:bg-muted rounded-md border-b last:border-0 cursor-pointer"
                                    role="option"
                                >
                                    <div className="flex items-center justify-between ">
                                        <div>
                                            <div
                                                className={`font-medium ${
                                                    locale === "ar" &&
                                                    "text-right"
                                                }`}
                                            >
                                                {dest.city},{" "}
                                                {dest.country.split("-").at(0)}
                                            </div>
                                            <div className="text-muted-foreground">
                                                {dest.airport ||
                                                    dest.country
                                                        .split("-")
                                                        .at(1)}
                                            </div>
                                        </div>
                                        <div className="font-medium text-muted-foreground">
                                            {dest.label_code}
                                        </div>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500">
                                {t("operations.no_results")}
                            </div>
                        )
                    ) : (
                        // لو المستخدم مش بيبحث، نعرض الوجهات الشعبية
                        fillteredObj.map((dest) => (
                            <button
                                key={dest.label_code}
                                onClick={() => handleSelect(dest)}
                                className="w-full p-3 text-left hover:bg-muted rounded-md border-b last:border-0 cursor-pointer"
                                role="option"
                            >
                                <div className="flex items-center justify-between ">
                                    <div>
                                        <div
                                            className={`font-medium ${
                                                locale === "ar" && "text-right"
                                            }`}
                                        >
                                            {dest.city},{" "}
                                            {dest.country.split("-").at(0)}
                                        </div>
                                        <div className="text-muted-foreground">
                                            {dest.airport ||
                                                dest.country.split("-").at(1)}
                                        </div>
                                    </div>
                                    <div className="font-medium text-muted-foreground">
                                        {dest.label_code}
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </ScrollArea>
        </PopoverContent>
    );
}
