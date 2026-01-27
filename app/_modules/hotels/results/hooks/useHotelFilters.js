"use client";

import { useState, useCallback } from "react";
import { INITIAL_FILTERS } from "../constants/filterOptions";

/**
 * Hook for managing hotel filters
 * @param {Array} hotels - Initial hotels array to derive filter options
 * @returns {Object} - Filter state and handlers
 */
export function useHotelFilters(hotels = []) {
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    // Set price range filter
    const setPriceRange = useCallback((min, max) => {
        setFilters((prev) => ({
            ...prev,
            priceRange: { min, max },
        }));
    }, []);

    // Toggle star rating filter
    const toggleStarRating = useCallback((rating) => {
        setFilters((prev) => {
            const currentRatings = prev.starRatings || [];
            const newRatings = currentRatings.includes(rating)
                ? currentRatings.filter((r) => r !== rating)
                : [...currentRatings, rating];
            return {
                ...prev,
                starRatings: newRatings,
            };
        });
    }, []);

    // Toggle property type filter
    const togglePropertyType = useCallback((type) => {
        setFilters((prev) => {
            const currentTypes = prev.propertyTypes || [];
            const newTypes = currentTypes.includes(type)
                ? currentTypes.filter((t) => t !== type)
                : [...currentTypes, type];
            return {
                ...prev,
                propertyTypes: newTypes,
            };
        });
    }, []);

    // Remove a single filter
    const removeFilter = useCallback((filterType, value) => {
        setFilters((prev) => {
            switch (filterType) {
                case "priceRange":
                    return { ...prev, priceRange: { min: 0, max: Infinity } };
                case "starRating":
                    return {
                        ...prev,
                        starRatings: prev.starRatings.filter((r) => r !== value),
                    };
                case "propertyType":
                    return {
                        ...prev,
                        propertyTypes: prev.propertyTypes.filter((t) => t !== value),
                    };
                default:
                    return prev;
            }
        });
    }, []);

    // Reset all filters
    const resetFilters = useCallback(() => {
        setFilters(INITIAL_FILTERS);
    }, []);

    // Get active filters count
    const getActiveFiltersCount = useCallback(() => {
        let count = 0;
        if (filters.priceRange.min > 0 || filters.priceRange.max < Infinity) {
            count++;
        }
        count += filters.starRatings?.length || 0;
        count += filters.propertyTypes?.length || 0;
        return count;
    }, [filters]);

    return {
        filters,
        setFilters,
        setPriceRange,
        toggleStarRating,
        togglePropertyType,
        removeFilter,
        resetFilters,
        activeFiltersCount: getActiveFiltersCount(),
    };
}
