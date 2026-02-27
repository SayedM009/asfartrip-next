"use client";

import { useState, useMemo } from "react";
import RoomCard from "../molecules/RoomCard";
import RoomCardSkeleton from "../molecules/RoomCardSkeleton";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

/**
 * Rooms list with dynamic filter tabs
 * Tabs only appear when there are multiple distinct categories
 */
export default function RoomsList({
    hotelRooms = [],
    loading,
    selectedRoom,
    onSelectRoom,
    searchParams,
    searchPayload,
    hotelDetails,
}) {
    const t = useTranslations("Hotels.details");
    const [activeTab, setActiveTab] = useState("all");

    // Derive available tabs dynamically from room data
    const availableTabs = useMemo(() => {
        if (!hotelRooms || hotelRooms.length === 0) return [];

        const tabs = [];
        const hasMealType1 = hotelRooms.some(
            (r) => r.MealType === "1" || !r.MealType
        );
        const hasMealType2 = hotelRooms.some((r) => r.MealType === "2");
        const hasMealType3Plus = hotelRooms.some(
            (r) =>
                r.MealType === "3" ||
                r.MealType === "4" ||
                r.MealType === "5"
        );
        const hasFreeCancellation = hotelRooms.some(
            (r) => r.FreeCancellation === 1
        );

        // Count distinct categories
        const categories = [
            hasMealType1,
            hasMealType2,
            hasMealType3Plus,
        ].filter(Boolean).length;
        const hasMixedCancellation =
            hasFreeCancellation &&
            hotelRooms.some((r) => r.FreeCancellation !== 1);

        // Only show tabs if there are multiple distinct categories
        if (categories <= 1 && !hasMixedCancellation) return [];

        // Always show "All" when tabs are visible
        tabs.push({ key: "all", label: t("all") });

        if (hasMealType1) {
            tabs.push({ key: "room_only", label: t("room_only") });
        }
        if (hasMealType2) {
            tabs.push({
                key: "breakfast",
                label: t("breakfast_included"),
            });
        }
        if (hasMealType3Plus) {
            tabs.push({
                key: "board",
                label: t("half_board_plus"),
            });
        }
        if (hasMixedCancellation) {
            tabs.push({
                key: "free_cancel",
                label: t("free_cancellation"),
            });
        }

        return tabs;
    }, [hotelRooms, t]);

    // Filter rooms based on active tab
    const filteredRooms = useMemo(() => {
        if (activeTab === "all" || availableTabs.length === 0)
            return hotelRooms;

        switch (activeTab) {
            case "room_only":
                return hotelRooms.filter(
                    (r) => r.MealType === "1" || !r.MealType
                );
            case "breakfast":
                return hotelRooms.filter((r) => r.MealType === "2");
            case "board":
                return hotelRooms.filter(
                    (r) =>
                        r.MealType === "3" ||
                        r.MealType === "4" ||
                        r.MealType === "5"
                );
            case "free_cancel":
                return hotelRooms.filter((r) => r.FreeCancellation === 1);
            default:
                return hotelRooms;
        }
    }, [hotelRooms, activeTab, availableTabs.length]);

    // Loading state
    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <RoomCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    // Empty state
    if (!hotelRooms || hotelRooms.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                <p>{t("no_rooms_available")}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Dynamic Filter Tabs */}
            {availableTabs.length > 0 && (
                <div className="flex flex-wrap gap-2 pb-2 border-b border-border">
                    {availableTabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                                activeTab === tab.key
                                    ? "bg-accent-500 text-white shadow-sm"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Room Cards */}
            {filteredRooms.length > 0 ? (
                filteredRooms.map((room, index) => (
                    <RoomCard
                        key={room.ProviderCode || room.Name + index}
                        room={room}
                        isSelected={
                            selectedRoom &&
                            selectedRoom.ProviderCode === room.ProviderCode
                        }
                        onSelect={(r) => onSelectRoom(r)}
                        nights={searchParams?.nights || 1}
                        searchPayload={searchPayload}
                        hotelDetails={hotelDetails}
                        searchParams={searchParams}
                    />
                ))
            ) : (
                <div className="text-center py-8 text-muted-foreground">
                    <p>{t("no_rooms_available")}</p>
                </div>
            )}
        </div>
    );
}
