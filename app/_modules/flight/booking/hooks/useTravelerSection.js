"use client";

import { useState, useRef, useCallback } from "react";
import { calcAge } from "../utils/calcAge";
import { travelerAgeRules } from "../config/travelerRules";
import useBookingStore from "@/app/_store/bookingStore";

export function useTravelerSection(
    travelerNumber,
    travelerType,
    withAccordion
) {
    const sectionRef = useRef(null);

    const traveler = useBookingStore((s) => s.getTraveler(travelerNumber));
    const updateTraveler = useBookingStore((s) => s.updateTraveler);

    const [showValidation, setShowValidation] = useState(false);
    const [accordionValue, setAccordionValue] = useState("open");
    const [isLocked, setIsLocked] = useState(false);
    const [ageError, setAgeError] = useState("");

    // ---------------------------------------------------
    // Date Limits Based on Type
    // ---------------------------------------------------
    const getDateLimits = useCallback(() => {
        const today = new Date();

        switch (travelerType) {
            case "Adult":
                return {
                    maxDate: new Date(
                        today.getFullYear() - 12,
                        today.getMonth(),
                        today.getDate()
                    ),
                    minDate: new Date(
                        today.getFullYear() - 100,
                        today.getMonth(),
                        today.getDate()
                    ),
                };

            case "Child":
                return {
                    maxDate: new Date(
                        today.getFullYear() - 2,
                        today.getMonth(),
                        today.getDate()
                    ),
                    minDate: new Date(
                        today.getFullYear() - 12,
                        today.getMonth(),
                        today.getDate()
                    ),
                };

            case "Infant":
            default:
                return {
                    maxDate: today,
                    minDate: new Date(
                        today.getFullYear() - 2,
                        today.getMonth(),
                        today.getDate()
                    ),
                };
        }
    }, [travelerType]);

    const { minDate, maxDate } = getDateLimits();

    // ---------------------------------------------------
    // Age Validation Based on Rules
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
            updateTraveler(travelerNumber, { [field]: value });
        },
        [travelerNumber, updateTraveler, validateAge]
    );

    // ---------------------------------------------------
    // Select Saved Traveler
    // ---------------------------------------------------
    const handleSavedTravelerSelect = useCallback(
        (saved) => {
            updateTraveler(travelerNumber, {
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
        [travelerNumber, updateTraveler, validateAge]
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

        updateTraveler(travelerNumber, { isCompleted: true });

        if (withAccordion) {
            setAccordionValue("");
            setIsLocked(true);
        }

        return true;
    }, [allFieldsValid, updateTraveler, travelerNumber, withAccordion]);

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
        traveler,
        showValidation,
        accordionValue,
        isLocked,
        ageError,
        minDate,
        maxDate,
        setAccordionValue,
        handleFieldChange,
        handleSavedTravelerSelect,
        saveTraveler,
        api,
    };
}
