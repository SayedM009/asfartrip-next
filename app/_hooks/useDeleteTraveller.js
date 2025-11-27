"use client";

import { useTranslations } from "next-intl";
import useTravellersStore from "@/app/_modules/profile/store/travellersStore";
import { toast } from "sonner";

export function useDeleteTraveller() {
    const p = useTranslations("Profile");
    const { fetchTravellers } = useTravellersStore();

    const handleDeleteTraveller = async (
        travellerId,
        userId,
        onClose,
        travellerName
    ) => {
        if (!travellerId || !userId) {
            toast.error(t("missing_ids") || "Missing traveller or user ID");
            return;
        }

        try {
            const body = new URLSearchParams({
                user_id: String(userId),
                id: String(travellerId),
            }).toString();

            const res = await fetch("/api/dashboard/delete-traveller", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body,
            });

            const data = await res.json();

            const ok =
                res.ok &&
                (data?.status === "success" || data?.success === true);

            if (!ok) {
                throw new Error(data?.message || p("delete_traveller_failed"));
            }

            toast.success(
                p("delete_traveller_success", { traveller: travellerName }) ||
                "Traveller deleted successfully"
            );

            await fetchTravellers(userId);

            if (onClose) onClose();
        } catch (error) {
            console.error(" delete traveller error:", error.message);
            toast.error(
                p("delete_traveller_failed") || "Failed to delete traveller"
            );
        }
    };

    return { handleDeleteTraveller };
}