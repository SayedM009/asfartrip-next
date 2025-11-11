// app/_utils/travelers.js

import { differenceInDays, parseISO, isBefore } from "date-fns";
import { AlertCircle, CircleCheck, TriangleAlert } from "lucide-react";

export function parseTravelerFromApi(apiTraveler = {}) {
    let parsed = {};
    try {
        parsed = apiTraveler.json_list ? JSON.parse(apiTraveler.json_list) : {};
    } catch (e) {
        parsed = {};
    }

    return {
        id: apiTraveler.id,
        fk_user_id: apiTraveler.fk_user_id,
        user_type: apiTraveler.user_type,
        title: parsed.title || "",
        firstName: parsed.first_name || "",
        lastName: parsed.last_name || "",
        dateOfBirth: parsed.dob || "",
        passportNumber: parsed.passport_no || "",
        nationality: parsed.passport_country || "",
        passportExpiry: parsed.passport_expiry || "",
    };
}

export function travelerFormToJsonList(formTraveler = {}) {
    return {
        title: formTraveler.title || "",
        first_name: formTraveler.firstName || "",
        last_name: formTraveler.lastName || "",
        dob: formTraveler.dateOfBirth || "",
        passport_no: formTraveler.passportNumber || "",
        passport_country: formTraveler.nationality || "",
        passport_expiry: formTraveler.passportExpiry || "",
    };
}

export function getPassportStatus(expiryDate) {
    if (!expiryDate) {
        return {
            status: "unknown",
            label: "Unknown",
            bgColor: "bg-gray-100 dark:bg-gray-800",
            textColor: "text-gray-700 dark:text-gray-300",
        };
    }

    try {
        const today = new Date();
        const expiry = parseISO(expiryDate);
        const daysUntilExpiry = differenceInDays(expiry, today);

        if (isBefore(expiry, today)) {
            return {
                status: "expired",
                label: "Expired",
                bgColor: "bg-red-100 dark:bg-red-900/30",
                textColor: "text-red-700 dark:text-red-400",
                icon: <AlertCircle className="size-4" />,
            };
        }

        if (daysUntilExpiry <= 30) {
            return {
                status: "action_needed",
                label: "Action Needed",
                bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
                textColor: "text-yellow-700 dark:text-yellow-400",
                icon: <TriangleAlert className="size-4" />,
            };
        }

        return {
            status: "valid",
            label: "Valid",
            bgColor: "bg-green-100 dark:bg-green-900/30",
            textColor: "text-green-700 dark:text-green-400",
            icon: <CircleCheck className="size-4" />,
        };
    } catch (error) {
        console.error("Error parsing passport date:", error);
        return {
            status: "unknown",
            label: "Unknown",
            bgColor: "bg-gray-100",
            textColor: "text-gray-700",
        };
    }
}
