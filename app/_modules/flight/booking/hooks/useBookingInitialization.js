"use client";

import { useEffect } from "react";
import useBookingStore from "../store/bookingStore";

export function useBookingInitialization({ isLogged, userId, userType, initialCart }) {
    // 🟢 نحصل على كل action بواحد واحد
    const setUserId = useBookingStore((state) => state.setUserId);
    const setCart = useBookingStore((state) => state.setCart);
    const setInsurancePlans = useBookingStore(
        (state) => state.setInsurancePlans
    );
    const setTicket = useBookingStore((state) => state.setTicket);
    const setSearchInfo = useBookingStore((state) => state.setSearchInfo);
    const setUserType = useBookingStore((state) => state.setUserType);


    // Assign userId to booking store
    useEffect(() => {
        if (isLogged && userId) {
            setUserId(userId);
            setUserType(userType);
            console.log("2- from useBookingInitialization userType", userType)
        }
    }, [isLogged, userId, userType, setUserId, setUserType]);

    // Assign cart + insurance plans
    useEffect(() => {
        if (initialCart) {
            setCart(initialCart.CartData);


            if (initialCart.CartData?.searchInfo) {
                setSearchInfo(initialCart.CartData.searchInfo);
            }

            if (initialCart.CartData?.ticket) {
                setTicket(initialCart.CartData.ticket);
            }

            if (initialCart.Premium) {
                setInsurancePlans(initialCart.Premium);
            }
        }
    }, [initialCart, setCart, setInsurancePlans, setSearchInfo, setTicket]);
}
