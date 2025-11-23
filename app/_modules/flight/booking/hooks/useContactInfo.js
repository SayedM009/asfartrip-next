// app/_modules/booking/hooks/useContactInfo.js
"use client";

import { useState, useCallback } from "react";
import useBookingStore from "../store/bookingStore";
import { useTranslations } from "next-intl";

export function useContactInfo() {
    const t = useTranslations("Traveler");
    // نقرأ الـ contactInfo و الأكشن من الـ store
    const contactInfo = useBookingStore((s) => s.contactInfo);
    const updateContactInfo = useBookingStore((s) => s.updateContactInfo);

    const [errors, setErrors] = useState({});
    const [showValidation, setShowValidation] = useState(false);

    const validate = useCallback(
        (form) => {
            const next = form || contactInfo || {};
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
        [contactInfo, t]
    );

    const setField = useCallback(
        (key, value) => {
            // نحدث الـ store (هو اللي مسؤول عن isDataModified)
            updateContactInfo({ [key]: value });

            // نعمل validate على الفورم الجديد
            const nextForm = { ...contactInfo, [key]: value };
            validate(nextForm);
        },
        [updateContactInfo, contactInfo, validate]
    );

    const triggerValidation = useCallback(() => {
        setShowValidation(true);
        return validate();
    }, [validate]);

    return {
        data: contactInfo,
        errors,
        showValidation,
        setField,
        triggerValidation,
    };
}
