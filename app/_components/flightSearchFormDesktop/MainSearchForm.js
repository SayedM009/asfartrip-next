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
import { searchAirports } from "@/app/_libs/api-services";
import SwapButton from "../SwapButton";
import useCheckLocal from "@/app/_hooks/useCheckLocal";

// Popular destinations data
const popularDestinations = [
    {
        label_code: "NYC",
        city: "New York",
        country: "United States",
        airport: "John F. Kennedy International",
    },
    {
        label_code: "LON",
        city: "London",
        country: "United Kingdom",
        airport: "Heathrow Airport",
    },
    {
        label_code: "PAR",
        city: "Paris",
        country: "France",
        airport: "Charles de Gaulle Airport",
    },
    {
        label_code: "TOK",
        city: "Tokyo",
        country: "Japan",
        airport: "Narita International",
    },
    {
        label_code: "DXB",
        city: "Dubai",
        country: "United Arab Emirates",
        airport: "Dubai International",
    },
    {
        label_code: "SIN",
        city: "Singapore",
        country: "Singapore",
        airport: "Changi Airport",
    },
    {
        label_code: "LAX",
        city: "Los Angeles",
        country: "United States",
        airport: "Los Angeles International",
    },
    {
        label_code: "BCN",
        city: "Barcelona",
        country: "Spain",
        airport: "Barcelona-El Prat Airport",
    },
    {
        label_code: "SYD",
        city: "Sydney",
        country: "Australia",
        airport: "Sydney Kingsford Smith",
    },
    {
        label_code: "HKG",
        city: "Hong Kong",
        country: "Hong Kong",
        airport: "Hong Kong International",
    },
];

export default function MainSearchForm({
    departure,
    setDeparture,
    destination,
    setDestination,
}) {
    const [showDestinationResults, setShowDestinationResults] = useState(false);
    const [showDepartureResults, setShowDepartureResults] = useState(false);
    const [isSearchingDeparture, setIsSearchingDeparture] = useState(false);
    const [isSearchingDestination, setIsSearchingDestination] = useState(false);
    const [departureSearch, setDepartureSearch] = useState("");
    const [destinationSearch, setDestinationSearch] = useState("");
    const [departureResults, setDepartureResults] = useState([]);
    const [destinationResults, setDestinationResults] = useState([]);
    const t = useTranslations("Flight");

    const handleSearch = async (value, onSearch, onResults) => {
        onSearch(value);

        if (value && value.length > 2) {
            try {
                const data = await searchAirports(value);
                onResults(data);
            } catch (error) {
                console.error("Error searching destination airports:", error);
                onResults([]);
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
                <label className="block mb-2 text-muted-foreground text-sm">
                    {t("from")}
                </label>
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
                            aria-label={
                                isSearchingDeparture
                                    ? "Search departure city"
                                    : `Selected departure city: ${departure.city}`
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
                                    placeholder="Search departure city"
                                    className="h-12 pl-10   border-0"
                                    autoFocus
                                    onBlur={(e) => {
                                        // Only close if we're not clicking on a result
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
                                <div className="h-12 bg-input-background dark:bg-input-background/5 rounded-md border-0 px-3 py-2 pl-10 flex items-center">
                                    <span className="font-medium text-foreground capitalize">
                                        {departure.city}
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
                        sessionKey="departure"
                    />
                </Popover>
            </div>
            {/* Swap Button */}
            <div className="flex justify-center items-center mb-2">
                <SwapButton callBack={swapCities} />
            </div>
            {/* To City */}
            <div className="flex-1">
                <label className="block mb-2 text-muted-foreground text-sm">
                    {t("to")}
                </label>
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
                            aria-label={
                                isSearchingDeparture
                                    ? "Search destination city"
                                    : `Selected destination city: ${destination.city}`
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
                                    placeholder="Search destination city"
                                    className="h-12 pl-10 bg-input-background border-0"
                                    autoFocus
                                    onBlur={(e) => {
                                        // Only close if we're not clicking on a result
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
                                <div className="h-12 bg-input-background dark:bg-input-background/5 rounded-md border-0 px-3 py-2 pl-10 flex items-center">
                                    <span className="font-medium text-foreground capitalize">
                                        {destination.city}
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
                        sessionKey="destination"
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
    sessionKey,
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
                    {fillteredObj.length > 0 ? (
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
                    ) : search ? (
                        <div className="p-4 text-center text-gray-500">
                            {t("operations.no_results")}
                        </div>
                    ) : null}
                </div>
            </ScrollArea>
        </PopoverContent>
    );
}
