"use client"
import { useEffect } from "react";
import { toast } from "sonner";
import useTravellersStore from "@/app/_modules/profile/store/travellersStore";

export function useTravellersManager(userId, t) {
    const { fetchTravellers, isLoading, travellers, deleteTraveller } =
        useTravellersStore();

    useEffect(() => {
        if (!userId) return;
        fetchTravellers(userId).catch(() => {
            toast.error(t ? t("failed_load_travellers") : "Failed to load travellers");
        });
    }, [userId, fetchTravellers, t]);

    const handleDelete = async (travellerId) => {
        const confirmed = confirm(
            t ? t("confirm_delete_traveller") : "Are you sure you want to delete this traveller?"
        );
        if (!confirmed) return;

        try {
            await deleteTraveller(travellerId);
            toast.success(t ? t("traveller_deleted") : "Traveller deleted");
            await fetchTravellers(userId);
        } catch {
            toast.error(t ? t("failed_delete_traveller") : "Failed to delete traveller");
        }
    };

    return { travellers, isLoading, handleDelete };
}
