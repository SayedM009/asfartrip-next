"use client";

import { useState, useCallback } from "react";
import { DEFAULT_SORT } from "../constants/sortOptions";

/**
 * Hook for managing hotel sort
 * @returns {Object} - Sort state and handlers
 */
export function useHotelSort() {
    const [sortBy, setSortBy] = useState(DEFAULT_SORT);

    const updateSort = useCallback((sortValue) => {
        setSortBy(sortValue);
    }, []);

    return {
        sortBy,
        setSortBy: updateSort,
    };
}
