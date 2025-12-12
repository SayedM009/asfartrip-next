
import { differenceInDays, parseISO, isBefore } from "date-fns";
import { AlertCircle, CircleCheck, TriangleAlert } from "lucide-react";

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
