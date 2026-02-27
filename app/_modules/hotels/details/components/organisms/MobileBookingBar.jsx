"use client";

import { Button } from "@/components/ui/button";
import { useCurrency } from "@/app/_modules/currency/hooks/useCurrency";
import { useRouter } from "next/navigation";

/**
 * Fixed bottom bar for mobile with price and book button
 */
export default function MobileBookingBar({ selectedRoom, rooms, hotelId }) {
    const { formatPrice } = useCurrency();
    const router = useRouter();

    // Get minimum price from rooms
    const hotelRooms = rooms?.HotelRooms || (Array.isArray(rooms) ? rooms : []);
    const minPrice =
        hotelRooms.length > 0
            ? Math.min(...hotelRooms.map((r) => r.RoomPrice?.Price || 0))
            : 0;

    const handleBook = () => {
        if (selectedRoom) {
            // Navigate to booking
            router.push(
                `/hotels/booking?hotelId=${hotelId}&roomId=${selectedRoom.RoomId}`,
            );
        } else {
            // Scroll to rooms section
            document
                .getElementById("rooms")
                ?.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 md:hidden z-50">
            <div className="flex items-center justify-between gap-4">
                <div>
                    {selectedRoom ? (
                        <>
                            <p className="text-lg font-bold text-accent-600">
                                {formatPrice(
                                    selectedRoom.RoomPrice?.Price ||
                                    selectedRoom.TotalPrice ||
                                    selectedRoom.Price,
                                )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {selectedRoom.Name || "Selected Room"}
                            </p>
                        </>
                    ) : minPrice > 0 ? (
                        <>
                            <p className="text-sm text-muted-foreground">
                                From
                            </p>
                            <p className="text-lg font-bold">
                                {formatPrice(minPrice)}
                                <span className="text-sm font-normal">
                                    /night
                                </span>
                            </p>
                        </>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Select a room
                        </p>
                    )}
                </div>
                <Button
                    className="bg-accent-500 hover:bg-accent-600 min-w-[140px]"
                    size="lg"
                    onClick={handleBook}
                >
                    {selectedRoom ? "Book Now" : "Select Room"}
                </Button>
            </div>
        </div>
    );
}
