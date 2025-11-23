"use client";

import { useMemo, useState, useCallback } from "react";
import { parseISO, isBefore } from "date-fns";
import useTravellersStore from "@/app/_store/travellersStore";
import useAuthStore from "@/app/_modules/auth/store/authStore";

export function useSavedTravelers() {
    const { travellers } = useTravellersStore();
    const { session } = useAuthStore();

    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const userData = session?.fullData?.user;

    // -------------------------
    // Normalize Saved Travelers
    // -------------------------
    const mappedTravellers = useMemo(() => {
        if (!travellers) return [];

        return travellers
            .map((traveller) => {
                const data = JSON.parse(traveller.json_list || "{}");

                return {
                    id: `traveller-${traveller.id}`,
                    title: data.title || "",
                    firstName: data.first_name || "",
                    lastName: data.last_name || "",
                    dateOfBirth: data.dob || "",
                    passportNumber: data.passport_no || "",
                    passportExpiry: data.passport_expiry || "",
                    nationality: data.passport_country || "",
                };
            })
            .filter((traveler) => {
                if (!traveler.passportExpiry) return true;
                const expiry = parseISO(traveler.passportExpiry);
                return expiry && !isBefore(expiry, new Date());
            });
    }, [travellers]);

    // -------------------------
    // User as Traveler
    // -------------------------
    const currentUserTraveler = useMemo(() => {
        if (!userData) return null;

        return {
            id: `user-${userData.user_id}`,
            title: userData.title || "Mr",
            firstName: userData.firstname || "",
            lastName: userData.lastname || "",
            dateOfBirth: userData.dob || "",
            passportNumber: userData.middlename || "",
            passportExpiry: userData.passport_expiry || "",
            nationality: userData.country_code || "",
            isPrimary: true,
        };
    }, [userData]);

    // -------------------------
    // Merge list
    // -------------------------
    const allTravelers = useMemo(() => {
        const list = [...mappedTravellers];

        if (currentUserTraveler) {
            const exists = list.some(
                (t) =>
                    t.firstName === currentUserTraveler.firstName &&
                    t.lastName === currentUserTraveler.lastName
            );
            if (!exists) list.unshift(currentUserTraveler);
        }

        return list;
    }, [mappedTravellers, currentUserTraveler]);

    // -------------------------
    // Select Traveler
    // -------------------------
    const selectTraveler = useCallback(
        (travelerId, onSelect) => {
            const traveler = allTravelers.find((t) => t.id === travelerId);
            if (!traveler) return;

            setSelectedId(travelerId);

            onSelect?.({
                title: traveler.title,
                firstName: traveler.firstName,
                lastName: traveler.lastName,
                dateOfBirth: traveler.dateOfBirth,
                passportNumber: traveler.passportNumber,
                passportExpiry: traveler.passportExpiry,
                nationality: traveler.nationality,
            });

            setOpen(false);
        },
        [allTravelers]
    );

    return {
        open,
        setOpen,
        selectedId,
        setSelectedId,
        allTravelers,
        selectTraveler,
    };
}
