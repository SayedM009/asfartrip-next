"use client";

import { useEffect } from "react";
import useBookingStore from "../store/bookingStore";

export function useBookingInitialization({ isLogged, userId, initialCart }) {
    // 🟢 نحصل على كل action بواحد واحد
    const setUserId = useBookingStore((state) => state.setUserId);
    const setCart = useBookingStore((state) => state.setCart);
    const setInsurancePlans = useBookingStore(
        (state) => state.setInsurancePlans
    );

    // Assign userId to booking store
    useEffect(() => {
        if (isLogged && userId) {
            setUserId(userId);
        }
    }, [isLogged, userId, setUserId]);

    // Assign cart + insurance plans
    useEffect(() => {
        if (initialCart) {
            setCart(initialCart.CartData);
            if (initialCart.Premium) {
                setInsurancePlans(initialCart.Premium);
            }
        }
    }, [initialCart, setCart, setInsurancePlans]);
}
