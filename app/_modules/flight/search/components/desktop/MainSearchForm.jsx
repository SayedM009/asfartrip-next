"use client";
import { useState } from "react";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { MapPin, Plane } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDebouncedCallback } from "use-debounce";
import SwapButton from "@/app/_components/ui/SwapButton";
import DestinationsContent from "./DestinationsContent";
import { searchAirports } from "../../services/searchAirports";
import {
    popularDestinationsGCC,
    popularInternationalDestinations,
} from "../../constants/popularDestinations";

// Popular destinations data imported from shared constants file
// See: constants/popularDestinations.js

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
    const [isDepartureLoading, setIsDepartureLoading] = useState(false);
    const [isDestinationLoading, setIsDestinationLoading] = useState(false);
    const t = useTranslations("Flight");

    // ========================
    // Debounced Search Handler
    // ========================
    /**
     * Debounced airport search - reduces API calls by waiting 350ms after user stops typing
     * Applies validation to filter out incomplete/invalid airports
     */
    const debouncedSearch = useDebouncedCallback(
        async (value, onResults, setLoading) => {
            if (!value || value.length <= 2) {
                onResults([]);
                setLoading(false);
                return;
            }

            try {
                const data = await searchAirports(value);

                // Filter invalid / incomplete results
                const validResults = data.filter(
                    (d) =>
                        d.label_code?.length === 3 &&
                        d.city &&
                        d.country &&
                        !d.city.toLowerCase().includes("test"),
                );

                onResults(validResults);
            } catch (error) {
                console.error("Error searching airports:", error);
                onResults([]);
            } finally {
                setLoading(false);
            }
        },
        350,
    );

    /**
     * Handle search input change
     */
    const handleSearch = (value, onSearch, onResults, setLoading) => {
        onSearch(value);

        if (value && value.length > 2) {
            setLoading(true);
            onResults([]); // clear old results immediately
            debouncedSearch(value, onResults, setLoading);
        } else {
            onResults([]);
            setLoading(false);
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
            <div className="col-span-3">
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
                            role="button"
                            tabIndex={0}
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
                                            setDepartureResults,
                                            setIsDepartureLoading,
                                        )
                                    }
                                    placeholder={t(
                                        "operations.departure_search",
                                    )}
                                    className="h-12 pl-10 border-0 rtl:pr-10"
                                    autoFocus
                                    onBlur={(e) => {
                                        if (
                                            !e.relatedTarget?.closest(
                                                '[role="option"]',
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
                                        {departure?.city ||
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
                        isLoading={isDepartureLoading}
                    />
                </Popover>
            </div>

            {/* Swap */}
            <div className="flex justify-center items-center mb-2 col-span-1">
                <SwapButton callBack={swapCities} />
            </div>

            {/* Destination */}
            <div className="col-span-3">
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
                            role="button"
                            tabIndex={0}
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
                                            setDestinationResults,
                                            setIsDestinationLoading,
                                        )
                                    }
                                    placeholder={t(
                                        "operations.destination_search",
                                    )}
                                    className="h-12 pl-10 bg-input-background border-0 rtl:pr-10"
                                    autoFocus
                                    onBlur={(e) => {
                                        if (
                                            !e.relatedTarget?.closest(
                                                '[role="option"]',
                                            )
                                        ) {
                                            setTimeout(() => {
                                                setIsSearchingDestination(
                                                    false,
                                                );
                                                setDestinationSearch("");
                                                setShowDestinationResults(
                                                    false,
                                                );
                                            }, 100);
                                        }
                                    }}
                                />
                            ) : (
                                <div className="h-12 bg-input-background dark:bg-input-background/5 rounded-md border-0 rtl:pr-10 py-2 pl-10 flex items-center">
                                    <span className="font-medium text-foreground capitalize">
                                        {destination?.city ||
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
                        isLoading={isDestinationLoading}
                    />
                </Popover>
            </div>
        </>
    );
}
