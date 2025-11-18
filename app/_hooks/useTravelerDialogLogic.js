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
    const t = useTranslations("Profile");
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [traveller]);

    const handleFieldChange = (field, value) => {
        setFormTraveler((prev) => ({ ...prev, [field]: value }));
    };

    function isFormValid(ft) {
        return !!(
            ft.firstName &&
            ft.lastName &&
            ft.dateOfBirth &&
            ft.passportNumber &&
            ft.nationality &&
            ft.passportExpiry
        );
    }

    const handleSave = async () => {
        if (!isFormValid(formTraveler)) {
            setShowValidation(true);
            toast.error(t("fields_required"));
            return;
        }

        if (!userId || !userType) {
            toast.error(t("technical_issue"));
            return;
        }

        setLoading(true);
        try {
            let res, data;

            if (traveller) {
                // ✏️ Update
                const payload = {
                    user_id: userId,
                    id: traveller.id,
                    list: {
                        title: formTraveler.title,
                        first_name: formTraveler.firstName,
                        last_name: formTraveler.lastName,
                        dob: formTraveler.dateOfBirth,
                        passport_no: formTraveler.passportNumber,
                        passport_country: formTraveler.nationality,
                        passport_expiry: formTraveler.passportExpiry,
                        country: formTraveler.nationality,
                    },
                };

                res = await fetch("/api/dashboard/update-traveller", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                data = await res.json();

                const ok =
                    res.ok &&
                    (data?.status === "success" || data?.success === true);
                if (!ok) {
                    throw new Error(data?.message || t("failed_saving"));
                }

                toast.success(t("traveller_updated_successfully"));
            } else {
                // ➕ Add
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
                data = await res.json();

                const ok =
                    res.ok &&
                    (data?.success === true || data?.status === "success");
                if (!ok) {
                    throw new Error(data?.message || t("failed_saving"));
                }

                toast.success(t("traveller_added_successfully"));
            }

            // 🔄 refresh store then close
            await fetchTravellers(userId);
            resetForm();
            onClose?.();
        } catch (error) {
            console.error("❌ save traveller error:", error?.message || error);
            if (retryCount >= 1) {
                toast.error(t("saving_not_available"));
                onClose?.();
            } else {
                toast.error(t("failed_saving"));
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

// "use client";

// import { useState, useEffect } from "react";
// import { toast } from "sonner";
// import useTravellersStore from "../_store/travellersStore";
// import {
//     parseTravelerFromApi,
//     travelerFormToJsonList,
// } from "../_utils/travelers";
// import { useTranslations } from "next-intl";

// export function useTravelerDialogLogic({
//     traveller,
//     userId,
//     userType,
//     onClose,
// }) {
//     const p = useTranslations("Profile");
//     const { fetchTravellers } = useTravellersStore();

//     const [loading, setLoading] = useState(false);
//     const [retryCount, setRetryCount] = useState(0);
//     const [showValidation, setShowValidation] = useState(false);

//     const [formTraveler, setFormTraveler] = useState({
//         title: "",
//         firstName: "",
//         lastName: "",
//         dateOfBirth: "",
//         passportNumber: "",
//         nationality: "",
//         passportExpiry: "",
//     });

//     const resetForm = () => {
//         setFormTraveler({
//             title: "",
//             firstName: "",
//             lastName: "",
//             dateOfBirth: "",
//             passportNumber: "",
//             nationality: "",
//             passportExpiry: "",
//         });
//         setShowValidation(false);
//     };

//     useEffect(() => {
//         if (traveller) {
//             const parsed = parseTravelerFromApi(traveller);
//             setFormTraveler(parsed);
//             setShowValidation(false);
//         } else {
//             resetForm();
//         }
//     }, [traveller]);

//     const handleFieldChange = (field, value) => {
//         setFormTraveler((prev) => ({
//             ...prev,
//             [field]: value,
//         }));
//     };

//     function isFormValid(ft) {
//         if (!ft.firstName) return false;
//         if (!ft.lastName) return false;
//         if (!ft.dateOfBirth) return false;
//         if (!ft.passportNumber) return false;
//         if (!ft.nationality) return false;
//         if (!ft.passportExpiry) return false;
//         return true;
//     }

//     const handleSave = async () => {
//         if (!isFormValid(formTraveler)) {
//             setShowValidation(true);
//             toast.error(p("fields_required"));
//             return;
//         }

//         if (!userId || !userType) {
//             toast.error(
//                 "We’re sorry, but a technical issue occurred. Please try again later."
//             );
//             return;
//         }

//         setLoading(true);

//         try {
//             const json_list = travelerFormToJsonList(formTraveler);

//             const res = await fetch("/api/dashboard/add-traveller", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/x-www-form-urlencoded",
//                 },
//                 body: JSON.stringify({
//                     user_type: userType,
//                     user_id: userId,
//                     json_list,
//                 }),
//             });

//             const data = await res.json();

//             if (!res.ok || !data?.success) {
//                 throw new Error(data?.message || "Failed to save traveller");
//             }

//             toast.success(p("traveller_success"));

//             await fetchTravellers(userId);

//             resetForm();

//             onClose?.();
//         } catch (error) {
//             console.error("❌ save traveler error:", error.message);
//             if (retryCount >= 1) {
//                 toast.error(p("saving_not_available"));
//                 onClose?.();
//             } else {
//                 toast.error(p("failed_saving"));
//                 setRetryCount((c) => c + 1);
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     return {
//         loading,
//         formTraveler,
//         handleFieldChange,
//         handleSave,
//         showValidation,
//         resetForm,
//     };
// }
