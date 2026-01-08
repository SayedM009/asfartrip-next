"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";

/**
 * Hook for managing contact information in Insurance booking
 * Unlike Flight's useContactInfo, this doesn't use a store
 * Instead, it receives data and onDataChange from props
 */
export function useInsuranceContactInfo(data, onDataChange) {
    const t = useTranslations("Traveler");

    const [errors, setErrors] = useState({});
    const [showValidation, setShowValidation] = useState(false);

    const validate = useCallback(
        (form) => {
            const next = form || data || {};
            const newErrors = {};

            // Booker name
            if (
                next.bookingForSomeoneElse &&
                (!next.bookerName || !next.bookerName.trim())
            ) {
                newErrors.bookerName = t("full_name_required");
            }

            // Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!next.email || !emailRegex.test(next.email.trim())) {
                newErrors.email = t("email_required");
            }

            // Phone
            if (!next.phone || next.phone.trim().length < 7) {
                newErrors.phone = t("phone_required");
            }

            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        },
        [data, t]
    );

    const setField = useCallback(
        (key, value) => {
            // Update via callback
            const nextForm = { ...data, [key]: value };
            onDataChange?.(nextForm);

            // Validate on the new form
            validate(nextForm);
        },
        [data, onDataChange, validate]
    );

    const triggerValidation = useCallback(() => {
        setShowValidation(true);
        return validate();
    }, [validate]);

    return {
        errors,
        showValidation,
        setField,
        triggerValidation,
    };
}
