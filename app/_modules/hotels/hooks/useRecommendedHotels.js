"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { getRecommendedHotels } from "@/app/_modules/hotels/services/getRecommendedHotels";
import { CONTINENTS } from "@/app/_modules/hotels/constants/continentsCities";

/**
 * Custom hook for managing continent/city selection and hotel recommendations
 */
export function useRecommendedHotels(defaultContinent = "asia", defaultCity = "Dubai") {
    const [selectedContinent, setSelectedContinent] = useState(defaultContinent);
    const [selectedCity, setSelectedCity] = useState(null);
    const [hotels, setHotels] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const initialLoadDone = useRef(false);

    // Get current continent data
    const currentContinent = CONTINENTS.find((c) => c.id === selectedContinent) || CONTINENTS[0];
    const cities = currentContinent?.cities || [];

    // Select city and fetch hotels
    const selectCity = useCallback(async (city) => {
        if (!city) return;

        setSelectedCity(city);
        setIsLoading(true);
        setError(null);
        // Don't clear hotels to keep showing previous while loading

        try {
            const result = await getRecommendedHotels(city.name, city.country);
            if (result.success) {
                setHotels(result.data || []);
            } else {
                setError(result.error || "Failed to fetch hotels");
            }
        } catch (err) {
            setError(err.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Change continent and auto-select first city
    const changeContinent = useCallback((continentId) => {
        setSelectedContinent(continentId);
        setError(null);

        // Get first city of the new continent
        const newContinent = CONTINENTS.find((c) => c.id === continentId);
        const firstCity = newContinent?.cities?.[0];

        if (firstCity) {
            // Clear previous hotels before selecting new city
            setHotels([]);
            setSelectedCity(firstCity);
            setIsLoading(true);

            // Fetch hotels for first city
            getRecommendedHotels(firstCity.name, firstCity.country)
                .then((result) => {
                    if (result.success) {
                        setHotels(result.data || []);
                    } else {
                        setError(result.error || "Failed to fetch hotels");
                    }
                })
                .catch((err) => {
                    setError(err.message || "An error occurred");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setSelectedCity(null);
            setHotels([]);
        }
    }, []);

    // Auto-select default city on mount
    useEffect(() => {
        if (!initialLoadDone.current && cities.length > 0 && defaultCity) {
            const cityToSelect = cities.find(c => c.name === defaultCity) || cities[0];
            if (cityToSelect) {
                selectCity(cityToSelect);
                initialLoadDone.current = true;
            }
        }
    }, [cities, defaultCity, selectCity]);

    // Clear selection
    const clearSelection = useCallback(() => {
        setSelectedCity(null);
        setHotels([]);
        setError(null);
    }, []);

    return {
        // State
        selectedContinent,
        selectedCity,
        hotels,
        isLoading,
        error,
        // Computed
        currentContinent,
        cities,
        continents: CONTINENTS,
        // Actions
        changeContinent,
        selectCity,
        clearSelection,
    };
}
