"use client";

import { useState, useCallback } from "react";
import useHotelBookingStore from "../store/hotelBookingStore";

/**
 * Hook for managing guest information form state and validation.
 */
export function useGuestInfo() {
    const [showValidation, setShowValidation] = useState(false);

    const leadGuest = useHotelBookingStore((state) => state.leadGuest);
    const otherGuests = useHotelBookingStore((state) => state.otherGuests);
    const updateLeadGuest = useHotelBookingStore((state) => state.updateLeadGuest);
    const updateOtherGuest = useHotelBookingStore((state) => state.updateOtherGuest);
    const validateLeadGuest = useHotelBookingStore((state) => state.validateLeadGuest);
    const validateOtherGuests = useHotelBookingStore((state) => state.validateOtherGuests);

    // Field-level errors for lead guest
    const getLeadErrors = useCallback(() => {
        if (!showValidation) return {};

        const errors = {};
        if (!leadGuest.salutation) errors.salutation = true;
        if (!leadGuest.firstName?.trim()) errors.firstName = true;
        if (!leadGuest.lastName?.trim()) errors.lastName = true;
        if (!leadGuest.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadGuest.email)) {
            errors.email = true;
        }
        if (!leadGuest.phoneNumber?.trim() || leadGuest.phoneNumber.trim().length < 7) {
            errors.phoneNumber = true;
        }
        if (!leadGuest.address?.trim()) errors.address = true;
        if (!leadGuest.countryCode?.trim()) errors.countryCode = true;

        return errors;
    }, [showValidation, leadGuest]);

    // Field-level errors for other guests
    const getOtherGuestErrors = useCallback(
        (index) => {
            if (!showValidation) return {};

            const guest = otherGuests[index];
            if (!guest) return {};

            const errors = {};
            if (!guest.salutation) errors.salutation = true;
            if (!guest.firstName?.trim()) errors.firstName = true;
            if (!guest.lastName?.trim()) errors.lastName = true;

            return errors;
        },
        [showValidation, otherGuests]
    );

    // Trigger validation and return whether all is valid
    const triggerValidation = useCallback(() => {
        setShowValidation(true);
        return validateLeadGuest() && validateOtherGuests();
    }, [validateLeadGuest, validateOtherGuests]);

    return {
        leadGuest,
        otherGuests,
        updateLeadGuest,
        updateOtherGuest,
        showValidation,
        getLeadErrors,
        getOtherGuestErrors,
        triggerValidation,
    };
}
