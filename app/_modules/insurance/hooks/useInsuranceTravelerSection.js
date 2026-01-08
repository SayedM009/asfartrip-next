"use client";

import { useState, useRef, useCallback } from "react";
import { travelerAgeRules } from "../config/travelerRules";

function calcAge(dob) {
    if (!dob) return null;
    const d = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
    return age;
}

/**
 * Hook for managing a single traveler section in Insurance booking
 * Unlike Flight's useTravelerSection, this doesn't use a store
 * Instead, it receives traveler data and update function from props
 */
export function useInsuranceTravelerSection(
    traveler,
    onTravelerChange,
    travelerType,
    withAccordion = true
) {
    const sectionRef = useRef(null);

    const [showValidation, setShowValidation] = useState(false);
    const [accordionValue, setAccordionValue] = useState("open");
    const [isLocked, setIsLocked] = useState(false);
    const [ageError, setAgeError] = useState("");

    // ---------------------------------------------------
    // Date Limits Based on Type (Insurance Rules)
    // Adults: 17-65, Children: 0-16, Seniors: 66-75
    // ---------------------------------------------------
    const getDateLimits = useCallback(() => {
        const today = new Date();

        switch (travelerType) {
            case "Adult":
                return {
                    // Max date: person must be at least 17 years old
                    maxDate: new Date(
                        today.getFullYear() - 17,
                        today.getMonth(),
                        today.getDate()
                    ),
                    // Min date: person must be at most 65 years old
                    minDate: new Date(
                        today.getFullYear() - 65,
                        today.getMonth(),
                        today.getDate()
                    ),
                };

            case "Child":
                return {
                    // Max date: can be born today (age 0)
                    maxDate: today,
                    // Min date: must be at most 16 years old
                    minDate: new Date(
                        today.getFullYear() - 16,
                        today.getMonth(),
                        today.getDate()
                    ),
                };

            case "Senior":
            default:
                return {
                    // Max date: must be at least 66 years old
                    maxDate: new Date(
                        today.getFullYear() - 66,
                        today.getMonth(),
                        today.getDate()
                    ),
                    // Min date: must be at most 75 years old
                    minDate: new Date(
                        today.getFullYear() - 75,
                        today.getMonth(),
                        today.getDate()
                    ),
                };
        }
    }, [travelerType]);

    const { minDate, maxDate } = getDateLimits();

    // ---------------------------------------------------
    // Age Validation Based on Insurance Rules
    // ---------------------------------------------------
    const validateAge = useCallback(
        (dob) => {
            const age = calcAge(dob);
            if (age === null) return { valid: false, message: "" };

            const rule = travelerAgeRules[travelerType];
            if (!rule) return { valid: true, message: "" };

            if (age < rule.minAge || age > rule.maxAge) {
                return { valid: false, message: rule.errorKey };
            }

            return { valid: true, message: "" };
        },
        [travelerType]
    );

    // ---------------------------------------------------
    // Validate All Fields
    // ---------------------------------------------------
    const allFieldsValid = useCallback(() => {
        if (!traveler) return false;

        const hasAll =
            traveler.title &&
            traveler.firstName &&
            traveler.lastName &&
            traveler.dateOfBirth &&
            traveler.passportNumber &&
            traveler.passportExpiry &&
            traveler.nationality;

        if (!hasAll) return false;

        const ageCheck = validateAge(traveler.dateOfBirth);
        if (!ageCheck.valid) {
            setAgeError(ageCheck.message);
            return false;
        }

        setAgeError("");
        return true;
    }, [traveler, validateAge]);

    // ---------------------------------------------------
    // Change Field
    // ---------------------------------------------------
    const handleFieldChange = useCallback(
        (field, value) => {
            if (field === "dateOfBirth" && value) {
                const ageCheck = validateAge(value);
                setAgeError(ageCheck.valid ? "" : ageCheck.message);
            }
            onTravelerChange({ ...traveler, [field]: value });
        },
        [traveler, onTravelerChange, validateAge]
    );

    // ---------------------------------------------------
    // Select Saved Traveler
    // ---------------------------------------------------
    const handleSavedTravelerSelect = useCallback(
        (saved) => {
            onTravelerChange({
                ...traveler,
                title: saved.title || "",
                firstName: saved.firstName || "",
                lastName: saved.lastName || "",
                dateOfBirth: saved.dateOfBirth
                    ? new Date(saved.dateOfBirth)
                    : null,
                passportNumber: saved.passportNumber || "",
                passportExpiry: saved.passportExpiry
                    ? new Date(saved.passportExpiry)
                    : null,
                nationality: saved.nationality || "",
            });

            if (saved.dateOfBirth) {
                const ageCheck = validateAge(saved.dateOfBirth);
                setAgeError(ageCheck.valid ? "" : ageCheck.message);
            }
        },
        [traveler, onTravelerChange, validateAge]
    );

    // ---------------------------------------------------
    // Save button
    // ---------------------------------------------------
    const saveTraveler = useCallback(() => {
        setShowValidation(true);
        const valid = allFieldsValid();

        if (!valid) {
            sectionRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            if (withAccordion) setAccordionValue("open");
            return false;
        }

        onTravelerChange({ ...traveler, isCompleted: true });

        if (withAccordion) {
            setAccordionValue("");
            setIsLocked(true);
        }

        return true;
    }, [allFieldsValid, traveler, onTravelerChange, withAccordion]);

    // ---------------------------------------------------
    // Imperative Handle
    // ---------------------------------------------------
    const api = {
        triggerValidation: () => {
            setShowValidation(true);
            return allFieldsValid();
        },
        getData: () => traveler,
        open: () => setAccordionValue("open"),
        close: () => {
            setAccordionValue("");
            setIsLocked(true);
        },
    };

    return {
        sectionRef,
        showValidation,
        accordionValue,
        isLocked,
        ageError,
        minDate,
        maxDate,
        setAccordionValue: (val) => {
            setAccordionValue(val);
            if (val === "open") setIsLocked(false);
        },
        handleFieldChange,
        handleSavedTravelerSelect,
        saveTraveler,
        api,
    };
}
