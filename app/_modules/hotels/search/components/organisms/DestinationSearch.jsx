"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useDebouncedCallback } from "use-debounce";
import { FlagTriangleRight, BedDouble } from "lucide-react";
import { POPULAR_DESTINATIONS } from "../../constants/popularDestinations";
import { searchHotels } from "../../services/searchHotels";
import DestinationSearchDialog from "./DestinationSearchDialog";

export default function DestinationSearch({ value, onChange, t }) {
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    /**
     * Debounced hotel search - waits 350ms after user stops typing
     * Combines locations and hotels from API response
     */
    const debouncedSearch = useDebouncedCallback(async (searchTerm) => {
        if (!searchTerm || searchTerm.trim().length < 2) {
            setSearchResults([]);
            setIsLoading(false);
            setHasSearched(false);
            return;
        }

        try {
            const { locations, hotels } = await searchHotels(searchTerm.trim());
            // Combine locations and hotels, locations first
            setSearchResults([...locations, ...hotels]);
            setHasSearched(true);
        } catch (error) {
            console.error("Error searching hotels:", error);
            setSearchResults([]);
            setHasSearched(true);
        } finally {
            setIsLoading(false);
        }
    }, 350);

    const handleSearch = (searchTerm) => {
        if (!searchTerm || searchTerm.trim().length < 2) {
            setSearchResults([]);
            setIsLoading(false);
            setHasSearched(false);
            return;
        }

        setIsLoading(true);
        debouncedSearch(searchTerm);
    };

    const handleSelectDestination = (destName) => {
        onChange(destName);
        setSearchResults([]);
        setHasSearched(false);
        setIsPopoverOpen(false);
        setIsDialogOpen(false);
    };

    // Mobile input handler - updates value and triggers debounced search
    const handleMobileInputChange = (e) => {
        const newValue = e.target.value;
        onChange(newValue);
        handleSearch(newValue);
    };

    // Desktop input handler - updates value, opens popover, and triggers debounced search
    const handleDesktopInputChange = (e) => {
        const newValue = e.target.value;
        onChange(newValue);
        setIsPopoverOpen(true);
        handleSearch(newValue);
    };

    return (
        <>
            {/* Mobile Search */}
            <DestinationSearchDialog
                value={value}
                handleMobileInputChange={handleMobileInputChange}
                t={t}
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
                isLoading={isLoading}
                isPopoverOpen={isPopoverOpen}
                hasSearched={hasSearched}
                searchResults={searchResults}
                handleSelectDestination={handleSelectDestination}
            />
            {/* Desktop Search */}
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild className="md:block hidden">
                    <div
                        className="col-span-3 border px-3 py-1 rounded-sm cursor-pointer"
                        onClick={() => setIsPopoverOpen(true)}
                    >
                        <Label className="text-xs">{t("destination")}</Label>
                        <Input
                            className="!outline-none !ring-0 !shadow-none bg-transparent dark:bg-transparent p-0 rounded-none h-fit py-1 border-none capitalize"
                            placeholder={t("search_input_placeholder")}
                            type="search"
                            value={value}
                            onChange={handleDesktopInputChange}
                            onFocus={() => setIsPopoverOpen(true)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </PopoverTrigger>
                <PopoverContent
                    className="min-w-[var(--radix-popover-trigger-width)] w-auto p-0 overflow-hidden"
                    align="start"
                    side="bottom"
                >
                    {!value.trim() ? (
                        <div>
                            <Label className="block w-full bg-gray-100 dark:bg-muted p-2 font-bold">
                                {t("popular_destinations")}
                            </Label>
                            <div className="p-2 grid grid-cols-5 gap-2 text-center">
                                {POPULAR_DESTINATIONS.map((dest) => (
                                    <p
                                        key={dest}
                                        className="bg-gray-50 dark:bg-muted p-2 rounded-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm capitalize"
                                        onClick={() =>
                                            handleSelectDestination(dest)
                                        }
                                    >
                                        {dest}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ) : isLoading ? (
                        <div className="p-4 text-center text-muted-foreground">
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
                                {t("searching")}
                            </div>
                        </div>
                    ) : hasSearched && searchResults.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                            <p className="text-sm">{t("no_results")}</p>
                            <p className="text-xs mt-1">
                                {t("no_results_hint")}
                            </p>
                        </div>
                    ) : (
                        <div className="max-h-60 overflow-y-auto">
                            {searchResults.map((result) => (
                                <div
                                    key={result.id}
                                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer border-b last:border-b-0 transition-colors flex items-center gap-3"
                                    onClick={() =>
                                        handleSelectDestination(result.name)
                                    }
                                >
                                    {result.type === "location" ? (
                                        <FlagTriangleRight className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                                    ) : (
                                        <BedDouble className="h-4 w-4 text-accent-500 mt-0.5 shrink-0" />
                                    )}
                                    <div>
                                        <p className="font-medium text-sm">
                                            {result.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {result.country}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </PopoverContent>
            </Popover>
        </>
    );
}
