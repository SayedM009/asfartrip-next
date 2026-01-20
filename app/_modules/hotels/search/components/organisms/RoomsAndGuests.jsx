"use client";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Minus, Plus } from "lucide-react";
import GuestCounter from "../molecules/GuestCounter";
import ChildAgeSelector from "../molecules/ChildAgeSelector";
import {
    ROOMS_MIN,
    ROOMS_MAX,
    ADULTS_MIN,
    ADULTS_MAX,
    CHILDREN_MIN,
    CHILDREN_MAX,
} from "../../constants/guestLimits";

import RoomsAndGuestsDialog from "./RoomsAndGuestsDialog";

/**
 * Rooms and guests selector (controlled) - Multi-room support
 * value structure: { rooms: [{ adults: 2, children: 0, childrenAges: [] }, ...] }
 */
export default function RoomsAndGuests({ value, onChange, t }) {
    const rooms = value.rooms || [{ adults: 2, children: 0, childrenAges: [] }];

    // Add a new room
    const addRoom = () => {
        if (rooms.length < ROOMS_MAX) {
            onChange({
                ...value,
                rooms: [...rooms, { adults: 2, children: 0, childrenAges: [] }],
            });
        }
    };

    // Remove last room
    const removeRoom = () => {
        if (rooms.length > ROOMS_MIN) {
            onChange({
                ...value,
                rooms: rooms.slice(0, -1),
            });
        }
    };

    // Update a specific room's field
    const updateRoom = (roomIndex, field, newValue) => {
        const newRooms = [...rooms];
        newRooms[roomIndex] = { ...newRooms[roomIndex], [field]: newValue };
        onChange({ ...value, rooms: newRooms });
    };

    // Update children count for a room
    const updateChildren = (roomIndex, newCount) => {
        const room = rooms[roomIndex];
        const currentAges = room.childrenAges || [];
        let newAges;
        if (newCount > currentAges.length) {
            newAges = [
                ...currentAges,
                ...Array(newCount - currentAges.length).fill(1),
            ];
        } else {
            newAges = currentAges.slice(0, newCount);
        }
        const newRooms = [...rooms];
        newRooms[roomIndex] = {
            ...room,
            children: newCount,
            childrenAges: newAges,
        };
        onChange({ ...value, rooms: newRooms });
    };

    // Update child age for a specific room
    const updateChildAge = (roomIndex, childIndex, age) => {
        const newRooms = [...rooms];
        const newAges = [...newRooms[roomIndex].childrenAges];
        newAges[childIndex] = age;
        newRooms[roomIndex] = {
            ...newRooms[roomIndex],
            childrenAges: newAges,
        };
        onChange({ ...value, rooms: newRooms });
    };

    // Calculate totals for display
    const totalAdults = rooms.reduce((sum, room) => sum + room.adults, 0);
    const totalChildren = rooms.reduce((sum, room) => sum + room.children, 0);

    return (
        <>
            {/* Mobile Search */}
            <RoomsAndGuestsDialog
                rooms={rooms}
                totalAdults={totalAdults}
                totalChildren={totalChildren}
                addRoom={addRoom}
                removeRoom={removeRoom}
                updateRoom={updateRoom}
                updateChildren={updateChildren}
                updateChildAge={updateChildAge}
                t={t}
            />
            {/* Desktop Search */}
            <Popover>
                <PopoverTrigger className="col-span-3 border px-3 rounded-sm cursor-pointer py-2 md:py-0 md:block hidden">
                    <Label className="text-xs">{t("rooms_and_guests")}</Label>
                    <p className="text-sm font-bold text-left rtl:text-right">
                        {rooms.length}{" "}
                        {rooms.length > 1 ? t("rooms") : t("room")},{" "}
                        {totalAdults} {t("adults")}, {totalChildren}{" "}
                        {t("children")}
                    </p>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] max-h-96 overflow-y-auto">
                    <div className="flex flex-col gap-4">
                        {/* Room count control */}
                        <div className="flex items-center justify-between gap-2 pb-2 border-b">
                            <Label className="text-sm font-bold">
                                {t("rooms")}
                            </Label>
                            <div className="flex items-center">
                                <Button
                                    variant="outline"
                                    className="w-6 h-6 rounded-full cursor-pointer border border-accent-500 text-accent-500 hover:bg-accent-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={removeRoom}
                                    disabled={rooms.length <= ROOMS_MIN}
                                >
                                    <Minus className="size-3" />
                                </Button>
                                <span className="w-10 text-center">
                                    {rooms.length}
                                </span>
                                <Button
                                    variant="outline"
                                    className="w-6 h-6 rounded-full cursor-pointer border border-accent-500 text-accent-500 hover:bg-accent-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={addRoom}
                                    disabled={rooms.length >= ROOMS_MAX}
                                >
                                    <Plus className="size-3" />
                                </Button>
                            </div>
                        </div>

                        {/* Individual room sections */}
                        {rooms.map((room, roomIndex) => (
                            <div
                                key={roomIndex}
                                className="flex flex-col gap-2 p-3 bg-gray-50 dark:bg-muted rounded-md"
                            >
                                <Label className="text-sm font-bold text-accent-500">
                                    {t("room")} {roomIndex + 1}
                                </Label>

                                <GuestCounter
                                    label={t("adults")}
                                    value={room.adults}
                                    min={ADULTS_MIN}
                                    max={ADULTS_MAX}
                                    onChange={(val) =>
                                        updateRoom(roomIndex, "adults", val)
                                    }
                                />

                                <GuestCounter
                                    label={t("children")}
                                    value={room.children}
                                    min={CHILDREN_MIN}
                                    max={CHILDREN_MAX}
                                    onChange={(val) =>
                                        updateChildren(roomIndex, val)
                                    }
                                />

                                {room.children > 0 && (
                                    <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <Label className="text-xs text-muted-foreground">
                                            {t("children_ages")}
                                        </Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {room.childrenAges.map(
                                                (age, childIndex) => (
                                                    <ChildAgeSelector
                                                        key={childIndex}
                                                        index={childIndex}
                                                        age={age}
                                                        onChange={(newAge) =>
                                                            updateChildAge(
                                                                roomIndex,
                                                                childIndex,
                                                                newAge,
                                                            )
                                                        }
                                                        t={t}
                                                    />
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        </>
    );
}
