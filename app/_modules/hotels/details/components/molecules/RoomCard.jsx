"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    Check,
    Bed,
    Wifi,
    Coffee,
    X,
    AlertTriangle,
    UtensilsCrossed,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/app/_modules/currency/hooks/useCurrency";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import useHotelBookingStore from "@/app/_modules/hotels/booking/store/hotelBookingStore";
import { getRateInfo } from "@/app/_modules/hotels/booking/services/hotelBookingService";

/**
 * Get meal plan label from MealType code
 */
function getMealIcon(mealType) {
    switch (mealType) {
        case "2":
            return <Coffee className="w-3.5 h-3.5" />;
        case "3":
        case "4":
        case "5":
            return <UtensilsCrossed className="w-3.5 h-3.5" />;
        default:
            return null;
    }
}

/**
 * Room card component — shows one room with its details
 */
export default function RoomCard({ room, isSelected, onSelect, nights = 1, searchPayload, hotelDetails, searchParams: hotelSearchParams }) {
    const { formatPrice } = useCurrency();
    const t = useTranslations("Hotels.details");
    const router = useRouter();
    const [bookingLoading, setBookingLoading] = useState(false);

    const initializeBooking = useHotelBookingStore((state) => state.initializeBooking);
    const setCartId = useHotelBookingStore((state) => state.setCartId);
    const setReferenceNo = useHotelBookingStore((state) => state.setReferenceNo);
    const setRateInfo = useHotelBookingStore((state) => state.setRateInfo);

    if (!room) return null;

    const price = room.RoomPrice?.Price || 0;
    const totalPrice = price * nights;
    const hasFreeCancellation = room.FreeCancellation === 1;
    const isLowAvailability = room.Available && room.Available <= 10;
    const mealLabel = getMealI18nKey(room.MealType);
    const boardName = room.BoardName || "";

    // Future fields (conditional rendering — will show when API provides them)
    const hasImage = !!room.RoomImage;
    const hasBedType = !!room.BedType;
    const hasMaxOccupancy = !!room.MaxOccupancy;
    const hasAmenities = room.Amenities && room.Amenities.length > 0;

    const encodedSearch = searchPayload;
    const roomLoad = room.RoomLoad;

    /**
     * Handle booking: call RateInfo → save to store → navigate
     */
    const handleBookRoom = async (e) => {
        e.stopPropagation();
        if (!roomLoad || !encodedSearch) return;

        setBookingLoading(true);
        try {
            // Call RateInfo API
            const rateData = await getRateInfo(roomLoad, encodedSearch);

            // Initialize booking store
            initializeBooking({
                hotelInfo: {
                    name: hotelDetails?.Name || "",
                    image: hotelDetails?.HotelImage || "",
                    rating: hotelDetails?.Rating || 0,
                    address: hotelDetails?.Address || "",
                },
                roomInfo: {
                    name: room.Name || "",
                    mealType: boardName || getMealI18nKey(room.MealType),
                    freeCancellation: hasFreeCancellation,
                    price: price,
                    currency: room.RoomPrice?.Currency || "AED",
                },
                searchParams: hotelSearchParams || {},
                encodedSearch,
                roomLoad,
                searchURL: window.location.href,
            });

            // Save rate info
            setRateInfo(rateData);
            setCartId(rateData?.CartId || "");
            setReferenceNo(rateData?.RateInfo?.ReferenceNo || "");

            // Navigate to booking
            router.push("/hotels/booking");
        } catch (error) {
            console.error("Failed to get rate info:", error);
            // TODO: show error toast
        } finally {
            setBookingLoading(false);
        }
    };

    return (
        <Card
            className={cn(
                "overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer py-0",
                isSelected
                    ? "ring-2 ring-accent-500 border-accent-500"
                    : "hover:border-accent-200"
            )}
            onClick={() => onSelect(room)}
        >
            <div className="flex flex-col md:flex-row">
                {/* Image — shows when API provides it */}
                {hasImage && (
                    <div className="relative w-full md:w-48 h-48 flex-shrink-0">
                        <Image
                            src={room.RoomImage}
                            alt={room.Name || "Room"}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 p-4">
                    <div className="flex flex-col gap-3">
                        {/* Header: Name + Badges */}
                        <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="space-y-1">
                                <h3 className="font-semibold text-base text-foreground">
                                    {room.Name || "Room"}
                                </h3>
                                {boardName && boardName !== room.Name && (
                                    <p className="text-sm text-muted-foreground">
                                        {boardName}
                                    </p>
                                )}
                            </div>

                            {/* Low Availability Warning */}
                            {isLowAvailability && (
                                <Badge
                                    variant="destructive"
                                    className="text-xs flex items-center gap-1"
                                >
                                    <AlertTriangle className="w-3 h-3" />
                                    {t("only_x_left", {
                                        count: room.Available,
                                    })}
                                </Badge>
                            )}
                        </div>

                        {/* Info Badges */}
                        <div className="flex flex-wrap gap-2">
                            {/* Meal badge */}
                            {mealLabel && (
                                <Badge
                                    variant="secondary"
                                    className="text-xs flex items-center gap-1"
                                >
                                    {getMealIcon(room.MealType)}
                                    {t(mealLabel)}
                                </Badge>
                            )}

                            {/* Cancellation badge */}
                            {hasFreeCancellation ? (
                                <Badge
                                    variant="outline"
                                    className="text-xs text-green-600 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 flex items-center gap-1"
                                >
                                    <Check className="w-3 h-3" />
                                    {t("free_cancellation")}
                                </Badge>
                            ) : (
                                <Badge
                                    variant="outline"
                                    className="text-xs text-red-600 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 flex items-center gap-1"
                                >
                                    <X className="w-3 h-3" />
                                    {t("non_refundable")}
                                </Badge>
                            )}

                            {/* Bed Type — future */}
                            {hasBedType && (
                                <Badge
                                    variant="outline"
                                    className="text-xs flex items-center gap-1"
                                >
                                    <Bed className="w-3 h-3" />
                                    {room.BedType}
                                </Badge>
                            )}

                            {/* Max Occupancy — future */}
                            {hasMaxOccupancy && (
                                <Badge
                                    variant="outline"
                                    className="text-xs flex items-center gap-1"
                                >
                                    <Users className="w-3 h-3" />
                                    {room.MaxOccupancy}
                                </Badge>
                            )}
                        </div>

                        {/* Amenities — future */}
                        {hasAmenities && (
                            <div className="flex flex-wrap gap-1.5">
                                {room.Amenities.slice(0, 4).map(
                                    (amenity, idx) => (
                                        <span
                                            key={idx}
                                            className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded"
                                        >
                                            {amenity}
                                        </span>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Price + Action */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between p-4 md:border-s border-t md:border-t-0 bg-muted/30 md:min-w-[160px]">
                    <div className="text-end">
                        <p className="text-xl font-bold text-accent-600">
                            {formatPrice(price)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {t("per_night")}
                        </p>
                        {nights > 1 && (
                            <p className="text-sm font-medium text-foreground mt-1">
                                {formatPrice(totalPrice)}{" "}
                                <span className="text-xs text-muted-foreground">
                                    {t("total")}
                                </span>
                            </p>
                        )}
                    </div>

                    <Button
                        size="sm"
                        variant={isSelected ? "default" : "outline"}
                        disabled={bookingLoading}
                        className={cn(
                            "mt-2",
                            isSelected &&
                            "bg-accent-500 hover:bg-accent-600 text-white"
                        )}
                        onClick={handleBookRoom}
                    >
                        {bookingLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isSelected ? (
                            <>
                                <Check className="w-4 h-4 me-1" />
                                {t("selected")}
                            </>
                        ) : (
                            t("select_room")
                        )}
                    </Button>
                </div>
            </div>
        </Card>
    );
}

/**
 * Get i18n key for meal type
 */
function getMealI18nKey(mealType) {
    switch (mealType) {
        case "2":
            return "breakfast_included";
        case "3":
        case "4":
        case "5":
            return "half_board_plus";
        case "1":
        default:
            return "room_only";
    }
}

