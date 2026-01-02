"use client";

import { useState, useEffect } from "react";
import { X, Search, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDebouncedCallback } from "use-debounce";
import { searchAirports } from "../../services/searchAirports";
import {
    popularDestinationsGCC,
    popularInternationalDestinations,
} from "../../constants/popularDestinations";
import { Input } from "@/components/ui/input";
import SpinnerMini from "@/app/_components/ui/SpinnerMini";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";

/**
 * LocationSearchDialog - Full-screen airport search dialog (Shadcn Dialog)
 *
 * Features:
 * - Reuses existing searchAirports service
 * - Shows popular destinations when no search
 * - Self-controlled open/close state
 * - Fixes keyboard open vibration issue on mobile
 */
export default function LocationSearchDialog({
    type,
    onSelect,
    locale,
    trigger,
}) {
    const t = useTranslations("Flight");
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Get popular destinations based on type
    const popularDestinations =
        type === "departure"
            ? popularDestinationsGCC
            : popularInternationalDestinations;

    // Debounced search
    const debouncedSearch = useDebouncedCallback(async (value) => {
        if (!value || value.length <= 2) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        try {
            const data = await searchAirports(value);
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

    const handleSearch = (value) => {
        setSearch(value);
        if (value && value.length > 2) {
            setIsLoading(true);
            debouncedSearch(value);
        } else {
            setResults([]);
            setIsLoading(false);
        }
    };

    const handleSelect = (airport) => {
        onSelect(airport);
        setOpen(false);
    };

    // Reset state when dialog closes
    useEffect(() => {
        if (!open) {
            setSearch("");
            setResults([]);
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen} modal={false}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent
                className="h-full w-full max-w-none rounded-none border-0 p-0 gap-0 "
                showCloseButton={false}
                onOpenAutoFocus={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader className="flex items-center flex-row gap-3 p-4 border-b">
                    <DialogClose className="p-2 -m-2" aria-label="Close">
                        <X className="w-6 h-6" />
                    </DialogClose>
                    <div className="flex-1 relative w-full">
                        <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            type="search"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder={
                                type === "departure"
                                    ? t("operations.departure_search") ||
                                      "From where?"
                                    : t("operations.destination_search") ||
                                      "To where?"
                            }
                            className="rounded-lg ps-10 h-12 text-base placeholder:text-gray-400 shadow-none focus:ring-1 focus:ring-primary-500"
                        />
                    </div>
                </DialogHeader>

                {/* Content */}
                <div className="overflow-y-auto flex-1 min-h-screen">
                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center h-56">
                            <SpinnerMini />
                        </div>
                    )}

                    {/* Search Results */}
                    {!isLoading && results.length > 0 && (
                        <div className="p-4 ">
                            {results.map((airport, index) => (
                                <button
                                    key={`${airport.label_code}-${index}`}
                                    type="button"
                                    onClick={() => handleSelect(airport)}
                                    className="w-full flex items-center gap-4 p-3 text-start rounded-xl transition-colors"
                                    role="option"
                                >
                                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-black dark:text-white truncate">
                                            {airport.city}
                                        </div>
                                        <div className="text-sm text-black dark:text-white truncate">
                                            {airport.label_code} ·{" "}
                                            {airport.country}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Popular Destinations (when no search) */}
                    {!isLoading && !search && (
                        <div className="p-4">
                            <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wide text-left rtl:text-right">
                                {t("popular_cities") || "Popular cities"}
                            </h3>
                            <div className="space-y-1">
                                {popularDestinations.map((dest, index) => (
                                    <button
                                        key={`${dest.label_code}-${index}`}
                                        type="button"
                                        onClick={() => handleSelect(dest)}
                                        className="w-full flex items-center gap-4 p-3 text-start hover:bg-[#0A2540] rounded-xl transition-colors"
                                        role="option"
                                    >
                                        <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold truncate text-black dark:text-white">
                                                {dest.city}
                                            </div>
                                            <div className="text-sm text-black dark:text-white truncate">
                                                {dest.label_code} ·{" "}
                                                {dest.country}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No Results */}
                    {!isLoading &&
                        search &&
                        results.length === 0 &&
                        search.length > 2 && (
                            <div className="flex flex-col items-center justify-center p-8 text-gray-400">
                                <Search className="w-12 h-12 mb-4 opacity-50" />
                                <p>
                                    {t("operations.no_results") ||
                                        "No airports found"}
                                </p>
                            </div>
                        )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
