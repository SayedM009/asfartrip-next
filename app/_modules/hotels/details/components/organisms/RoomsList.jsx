"use client";

import RoomCard from "../molecules/RoomCard";
import RoomCardSkeleton from "../molecules/RoomCardSkeleton";

/**
 * List of available rooms
 */
export default function RoomsList({
    rooms,
    loading,
    selectedRoom,
    onSelectRoom,
    searchParams,
}) {
    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <RoomCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (!rooms || rooms.length === 0) {
        return (
            <div className="text-center py-8 border rounded-lg bg-muted/50">
                <p className="text-muted-foreground">
                    {searchParams.checkIn
                        ? "No rooms available for the selected dates"
                        : "Select dates to see available rooms"}
                </p>
            </div>
        );
    }

    // return (
    //     <div className="space-y-4">
    //         {rooms?.map((room, index) => (
    //             <RoomCard
    //                 key={room.RoomId || index}
    //                 room={room}
    //                 isSelected={selectedRoom?.RoomId === room.RoomId}
    //                 onSelect={() => onSelectRoom(room)}
    //                 nights={searchParams.nights || 1}
    //             />
    //         ))}
    //     </div>
    // );
}
