"use client";
import { useState, useCallback, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { searchHotels } from "../services/searchHotels";

/**
 * Custom hook for destination search functionality
 * Handles debounced search, loading states, and result management
 */
export function useDestinationSearch({ onChange, initialValue = "" }) {
    const [inputValue, setInputValue] = useState(initialValue);
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Sync inputValue when initialValue changes (e.g., from URL params)
    useEffect(() => {
        if (initialValue && initialValue !== inputValue) {
            setInputValue(initialValue);
        }
    }, [initialValue]);

    /**
     * Debounced hotel search - waits 350ms after user stops typing
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

    const handleSearch = useCallback((searchTerm) => {
        if (!searchTerm || searchTerm.trim().length < 2) {
            setSearchResults([]);
            setIsLoading(false);
            setHasSearched(false);
            return;
        }
        setIsLoading(true);
        debouncedSearch(searchTerm);
    }, [debouncedSearch]);

    const handleSelectDestination = useCallback((destination) => {
        // destination is now always an object (from API or from popular destinations)
        setInputValue(destination.name);
        onChange({
            name: destination.name,
            id: destination.id,
            type: destination.type || "location", // popular destinations are always locations
            country: destination.country,
            countryCode: destination.countryCode,
        });
        setSearchResults([]);
        setHasSearched(false);
        setIsPopoverOpen(false);
        setIsDialogOpen(false);
    }, [onChange]);

    const handleInputChange = useCallback((newValue, openPopover = false) => {
        setInputValue(newValue);
        onChange({
            name: newValue,
            id: null,
            type: null,
            country: null,
            countryCode: null,
        });
        if (openPopover) {
            setIsPopoverOpen(true);
        }
        handleSearch(newValue);
    }, [onChange, handleSearch]);

    const handleMobileInputChange = useCallback((e) => {
        handleInputChange(e.target.value, false);
    }, [handleInputChange]);

    const handleDesktopInputChange = useCallback((e) => {
        handleInputChange(e.target.value, true);
    }, [handleInputChange]);

    return {
        inputValue,
        searchResults,
        isLoading,
        hasSearched,
        isPopoverOpen,
        setIsPopoverOpen,
        isDialogOpen,
        setIsDialogOpen,
        handleSearch,
        handleSelectDestination,
        handleMobileInputChange,
        handleDesktopInputChange,
    };
}
