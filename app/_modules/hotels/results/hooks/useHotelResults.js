"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { getHotelDetails } from "../services/getHotelDetails";
import { sortHotels } from "../utils/sortHotels";
import { filterHotels } from "../utils/filterHotels";
import { useHotelFilters } from "./useHotelFilters";
import { useHotelSort } from "./useHotelSort";

const ITEMS_PER_PAGE = 10;

/**
 * Main hook for managing hotel results with lazy loading, filtering, and sorting
 * @param {Array} initialHotels - Hotels from server-side fetch
 * @param {Object} searchPayload - Search parameters from API
 * @returns {Object} - Hotels state and handlers
 */
export function useHotelResults(initialHotels = [], searchPayload = {}) {
    // Raw hotels from API
    const [hotels, setHotels] = useState(initialHotels);

    // Enriched hotel details (lazy loaded)
    const [hotelDetails, setHotelDetails] = useState({});
    const [loadingDetails, setLoadingDetails] = useState({});

    // Pagination for infinite scroll
    const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

    // Filter and sort hooks
    const filterHook = useHotelFilters(initialHotels);
    const sortHook = useHotelSort();

    // Fetch hotel details lazily (when card is in view)
    const fetchHotelDetails = useCallback(async (hotelId) => {
        if (hotelDetails[hotelId] || loadingDetails[hotelId]) {
            return hotelDetails[hotelId];
        }

        setLoadingDetails((prev) => ({ ...prev, [hotelId]: true }));

        try {
            const result = await getHotelDetails(hotelId);
            if (result.success && result.data) {
                setHotelDetails((prev) => ({
                    ...prev,
                    [hotelId]: result.data,
                }));
                return result.data;
            }
        } catch (error) {
            console.error(`Failed to fetch details for hotel ${hotelId}:`, error);
        } finally {
            setLoadingDetails((prev) => ({ ...prev, [hotelId]: false }));
        }

        return null;
    }, [hotelDetails, loadingDetails]);

    // Get enriched hotel data (merge basic + details)
    const getEnrichedHotel = useCallback((hotel) => {
        const hotelId = hotel.HotelInfo?.Id;
        const details = hotelDetails[hotelId];

        if (!details) return hotel;

        return {
            ...hotel,
            HotelInfo: {
                ...hotel.HotelInfo,
                ...details,
                // Keep original values that might differ
                Picture: hotel.HotelInfo?.Picture,
            },
            enriched: true,
        };
    }, [hotelDetails]);

    // Apply filters and sorting
    const processedHotels = useMemo(() => {
        let result = [...hotels];

        // Apply filters
        result = filterHotels(result, filterHook.filters);

        // Apply sorting
        result = sortHotels(result, sortHook.sortBy);

        return result;
    }, [hotels, filterHook.filters, sortHook.sortBy]);

    // Hotels to display (with pagination)
    const displayedHotels = useMemo(() => {
        return processedHotels.slice(0, displayCount);
    }, [processedHotels, displayCount]);

    // Load more hotels for infinite scroll
    const loadMore = useCallback(() => {
        setDisplayCount((prev) => Math.min(prev + ITEMS_PER_PAGE, processedHotels.length));
    }, [processedHotels.length]);

    // Check if there are more hotels to load
    const hasMore = displayCount < processedHotels.length;

    // Reset display count when filters change
    useEffect(() => {
        setDisplayCount(ITEMS_PER_PAGE);
    }, [filterHook.filters, sortHook.sortBy]);


    return {
        // Hotels data
        hotels: displayedHotels,
        totalHotels: hotels.length,
        filteredCount: processedHotels.length,

        // Enrichment
        fetchHotelDetails,
        getEnrichedHotel,
        hotelDetails,
        isLoadingDetails: (hotelId) => loadingDetails[hotelId] || false,

        // Infinite scroll
        loadMore,
        hasMore,

        // Search params
        searchPayload,
        nights: searchPayload?.nights || 1,
        rooms: searchPayload?.room_count || 1,



        // Filter and sort (spread hooks)
        ...filterHook,
        ...sortHook,
    };
}
