"use client";

import { useEffect } from "react";
import useHotelBookingStore from "../store/hotelBookingStore";

/**
 * Initialize hotel booking store from page-level data.
 * Sets userId/userType from auth, and initializes other guests from roomsConfig.
 */
export function useHotelBookingInit({ isLogged, userId, userType }) {
    const setUserId = useHotelBookingStore((state) => state.setUserId);
    const setUserType = useHotelBookingStore((state) => state.setUserType);
    const initOtherGuests = useHotelBookingStore((state) => state.initOtherGuests);
    const searchParams = useHotelBookingStore((state) => state.searchParams);

    // Set user info
    useEffect(() => {
        if (isLogged && userId) {
            setUserId(userId);
            setUserType(userType);
        }
    }, [isLogged, userId, userType, setUserId, setUserType]);

    // Initialize other guests from rooms config
    useEffect(() => {
        if (searchParams?.roomsConfig) {
            initOtherGuests(searchParams.roomsConfig);
        }
    }, [searchParams?.roomsConfig, initOtherGuests]);
}
