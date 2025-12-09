"use client";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    LucideSearch,
    MapPin,
    PlaneLanding,
    PlaneTakeoff,
    X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { searchAirports } from "../../services/searchAirports";
import {
    popularDestinationsGCC,
    popularInternationalDestinations,
} from "../../constants/popularDestinations";
import SpinnerMini from "@/app/_components/ui/SpinnerMini";

/**
 * WegoDestinationSearchDialog - Wego-style airport/city selection dialog
 *
 * Features:
 * - Full-row clickable areas for better mobile UX
 * - Dynamic title based on type (departure/arrival)
 * - List-style city display with airport codes in badges
 * - Same search functionality as DestinationSearchDialog
 */
function WegoDestinationSearchDialog({
    destination,
    onSelect,
    locale,
    type = "departure",
}) {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const searchDirection = locale === "en" ? "left-3" : "right-3";
    const t = useTranslations("Flight");

    // Get appropriate icon and title based on type
    const isDeparture = type === "departure";
    const TriggerIcon = isDeparture ? PlaneTakeoff : PlaneLanding;
    const dialogTitle = isDeparture
        ? t("select_departure")
        : t("select_arrival");
    const triggerLabel = isDeparture ? t("from") : t("to");

    /**
     * Debounced airport search - reduces API calls by waiting 350ms after user stops typing
     */
    const debouncedSearch = useDebouncedCallback(async (value) => {
        if (!value || value.length <= 2) {
            setResults([]);
            setIsLoading(false);
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
                    !d.city.toLowerCase().includes("test")
            );

            setResults(validResults);
        } catch (error) {
            console.error("Error searching airports:", error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, 350);

    function handleSearch(value) {
        if (!value || value.length <= 2) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setResults([]);
        debouncedSearch(value);
    }

    function handleSelect(value) {
        onSelect({
            city: value.city,
            label_code: value.label_code,
            country: value.country,
        });
        setIsOpen(false);
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open);
                if (!open) setResults([]);
            }}
        >
            {/* Full-width clickable trigger */}
            <DialogTrigger className="w-full flex items-center gap-3 text-start">
                <TriggerIcon className="size-5 flex-shrink-0 text-muted-foreground dark:text-white" />
                {destination?.city ? (
                    // When city is selected - show label + city format
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground ">
                            {triggerLabel}
                        </span>
                        <span className="font-bold text-foreground capitalize">
                            {destination.city} ({destination.label_code})
                        </span>
                    </div>
                ) : (
                    // When no city selected - just show From/To
                    <span className="text-muted-foreground ">
                        {triggerLabel}
                    </span>
                )}
            </DialogTrigger>

            <DialogContent className="bg-background h-full w-full max-w-none rounded-none border-0 p-0 overflow-hidden">
                <DialogHeader className="p-4 border-b hidden">
                    <div className="flex items-center gap-3">
                        <DialogClose className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                            <X className="w-5 h-5" />
                            <span className="sr-only">Close</span>
                        </DialogClose>
                        <DialogTitle className="text-lg text-muted-foreground font-normal">
                            {dialogTitle}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="sr-only">
                        {dialogTitle}
                    </DialogDescription>
                </DialogHeader>

                <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
                    {/* Search Input */}
                    <div className="relative w-full mb-6">
                        <Input
                            type="search"
                            placeholder={t("search_by_city_airport")}
                            className="rounded-lg ps-10 h-12 text-base placeholder:text-gray-400 shadow-none focus:ring-1 focus:ring-primary-500"
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <LucideSearch
                            className={`absolute ${searchDirection} top-1/2 transform -translate-y-1/2 text-gray-400`}
                            size={20}
                        />
                    </div>

                    {/* Content */}
                    {isLoading ? (
                        <div className="flex items-center justify-center h-56">
                            <SpinnerMini />
                        </div>
                    ) : results.length > 0 ? (
                        <SearchResultsList
                            results={results}
                            onSelect={handleSelect}
                        />
                    ) : (
                        <PopularCitiesList onSelect={handleSelect} t={t} />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

/**
 * Search results from API - list style with full-row clickable
 */
function SearchResultsList({ results, onSelect }) {
    return (
        <div className="space-y-0">
            {results.map((result) => (
                <button
                    key={result.label_code + result.country}
                    onClick={() => onSelect(result)}
                    className="w-full flex items-center gap-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-start border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                            {result.city}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                            {String(result.country)
                                .split("-")
                                .slice(1)
                                .join("-") || result.country}
                        </p>
                    </div>
                    <span className="px-2 py-1 text-muted-foreground text-sm font-medium">
                        {result.label_code}
                    </span>
                </button>
            ))}
        </div>
    );
}

/**
 * Popular cities list - Wego style with location icons and badges
 */
function PopularCitiesList({ onSelect, t }) {
    // Combine GCC and International destinations for display
    const allCities = [
        ...popularDestinationsGCC,
        ...popularInternationalDestinations,
    ];

    return (
        <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                {t("popular_cities")}
            </h3>
            <div className="space-y-0">
                {allCities.map((city) => (
                    <button
                        key={city.label_code}
                        onClick={() => onSelect(city)}
                        className="w-full flex items-center gap-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-start border-b border-gray-100 dark:border-gray-800 last:border-0"
                    >
                        <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground">
                                {city.city}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {city.country}
                            </p>
                        </div>
                        <span className="px-2 py-1 text-muted-foreground text-sm font-medium">
                            {city.label_code}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default WegoDestinationSearchDialog;
