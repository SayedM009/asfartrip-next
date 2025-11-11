"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import useTravellersStore from "../_store/travellersStore";
import {
    parseTravelerFromApi,
    travelerFormToJsonList,
} from "../_utils/travelers";
import { useTranslations } from "next-intl";

export function useTravelerDialogLogic({
    traveller,
    userId,
    userType,
    onClose,
}) {
    const p = useTranslations("Profile");
    const { fetchTravellers } = useTravellersStore();

    const [loading, setLoading] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [showValidation, setShowValidation] = useState(false);

    const [formTraveler, setFormTraveler] = useState({
        title: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        passportNumber: "",
        nationality: "",
        passportExpiry: "",
    });

    const resetForm = () => {
        setFormTraveler({
            title: "",
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            passportNumber: "",
            nationality: "",
            passportExpiry: "",
        });
        setShowValidation(false);
    };

    useEffect(() => {
        if (traveller) {
            const parsed = parseTravelerFromApi(traveller);
            setFormTraveler(parsed);
            setShowValidation(false);
        } else {
            resetForm();
        }
    }, [traveller]);

    const handleFieldChange = (field, value) => {
        setFormTraveler((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    function isFormValid(ft) {
        if (!ft.firstName) return false;
        if (!ft.lastName) return false;
        if (!ft.dateOfBirth) return false;
        if (!ft.passportNumber) return false;
        if (!ft.nationality) return false;
        if (!ft.passportExpiry) return false;
        return true;
    }

    const handleSave = async () => {
        if (!isFormValid(formTraveler)) {
            setShowValidation(true);
            toast.error(p("fields_required"));
            return;
        }

        if (!userId || !userType) {
            toast.error(
                "We’re sorry, but a technical issue occurred. Please try again later."
            );
            return;
        }

        setLoading(true);

        try {
            const json_list = travelerFormToJsonList(formTraveler);

            const res = await fetch("/api/dashboard/add-traveller", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: JSON.stringify({
                    user_type: userType,
                    user_id: userId,
                    json_list,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data?.success) {
                throw new Error(data?.message || "Failed to save traveller");
            }

            toast.success(p("traveller_success"));

            await fetchTravellers(userId);

            resetForm();

            onClose?.();
        } catch (error) {
            console.error("❌ save traveler error:", error.message);
            if (retryCount >= 1) {
                toast.error(p("saving_not_available"));
                onClose?.();
            } else {
                toast.error(p("failed_saving"));
                setRetryCount((c) => c + 1);
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        formTraveler,
        handleFieldChange,
        handleSave,
        showValidation,
        resetForm,
    };
}
