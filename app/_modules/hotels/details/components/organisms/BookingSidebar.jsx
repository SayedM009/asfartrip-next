"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, ChevronRight } from "lucide-react";
import { useCurrency } from "@/app/_modules/currency/hooks/useCurrency";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

/**
 * Sticky booking sidebar for desktop
 */
export default function BookingSidebar({
    selectedRoom,
    searchParams,
    hotelId,
    hotelName,
}) {
    const { formatPrice } = useCurrency();
    const router = useRouter();

    const checkIn = searchParams.checkIn
        ? new Date(searchParams.checkIn)
        : null;
    const checkOut = searchParams.checkOut
        ? new Date(searchParams.checkOut)
        : null;
    const nights =
        checkIn && checkOut
            ? Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
            : 1;

    const handleContinue = () => {
        if (!selectedRoom) return;

        // Navigate to booking page with room data
        const params = new URLSearchParams({
            hotelId,
            roomId: selectedRoom.RoomId || selectedRoom.Id,
            checkIn: searchParams.checkIn,
            checkOut: searchParams.checkOut,
            adults: searchParams.adults,
            roomDetails:
                searchParams.roomDetails ||
                JSON.stringify([{ adults: searchParams.adults }]),
        });

        router.push(`/hotels/booking?${params.toString()}`);
    };

    return (
        <Card className="sticky top-24 p-6 space-y-4">
            {/* Dates */}
            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Check-in</span>
                    </div>
                    <span className="font-medium">
                        {checkIn ? format(checkIn, "MMM dd") : "-"}
                    </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Check-out</span>
                    </div>
                    <span className="font-medium">
                        {checkOut ? format(checkOut, "MMM dd") : "-"}
                    </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Guests</span>
                    </div>
                    <span className="font-medium">
                        {searchParams.adults} Adults
                    </span>
                </div>
            </div>

            {/* Selected Room Summary */}
            {selectedRoom ? (
                <div className="pt-4 border-t space-y-3">
                    <p className="text-sm font-medium">
                        {selectedRoom.RoomName || selectedRoom.Name}
                    </p>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                            {nights} night{nights > 1 ? "s" : ""}
                        </span>
                        <span>
                            {formatPrice(
                                selectedRoom.TotalPrice ||
                                    selectedRoom.Price * nights,
                            )}
                        </span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total</span>
                        <span className="text-accent-600">
                            {formatPrice(
                                selectedRoom.TotalPrice ||
                                    selectedRoom.Price * nights,
                            )}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground text-center">
                        Select a room to continue
                    </p>
                </div>
            )}

            {/* Continue Button */}
            <Button
                className="w-full bg-accent-500 hover:bg-accent-600"
                size="lg"
                disabled={!selectedRoom}
                onClick={handleContinue}
            >
                Continue to Booking
                <ChevronRight className="h-4 w-4 ms-2" />
            </Button>
        </Card>
    );
}
