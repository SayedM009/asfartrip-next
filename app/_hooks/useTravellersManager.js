"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import useTravellersStore from "../_store/travellersStore";

export function useTravellersManager(userId) {
    const { fetchTravellers, isLoading, travellers, deleteTraveller } =
        useTravellersStore();

    useEffect(() => {
        if (!userId) return;
        fetchTravellers(userId).catch(() => {
            toast.error("Failed to load travellers");
        });
    }, [userId, fetchTravellers]);

    const handleDelete = async (travellerId) => {
        const confirmed = confirm(
            "Are you sure you want to delete this traveller?"
        );
        if (!confirmed) return;

        try {
            await deleteTraveller(travellerId);
            toast.success("Traveller deleted");
            await fetchTravellers(userId);
        } catch {
            toast.error("Failed to delete traveller");
        }
    };

    return { travellers, isLoading, handleDelete };
}
