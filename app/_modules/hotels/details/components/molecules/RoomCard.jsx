"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Check, Bed, Wifi, Coffee, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/app/_modules/currency/hooks/useCurrency";

/**
 * Room card component
 */
export default function RoomCard({ room, isSelected, onSelect, nights = 1 }) {
    const { formatPrice } = useCurrency();

    // Extract room data
    const roomName = room.RoomName || room.Name || "Standard Room";
    const roomImage = room.RoomImage || room.Image || "/no-image.webp";
    const pricePerNight = room.Price || room.TotalPrice / nights || 0;
    const totalPrice = room.TotalPrice || pricePerNight * nights;
    const maxOccupancy = room.MaxOccupancy || room.Adults || 2;
    const bedType = room.BedType || "1 King Bed";
    const mealPlan = room.MealPlan || room.BoardBasis;
    const cancellationPolicy = room.CancellationPolicy || room.Refundable;
    const isRefundable =
        cancellationPolicy === "Refundable" || room.FreeCancellation;

    // Room amenities
    const amenities = room.Amenities || [];

    return (
        <Card
            className={cn(
                "overflow-hidden transition-all",
                isSelected
                    ? "ring-2 ring-accent-500 shadow-lg"
                    : "hover:shadow-md",
            )}
        >
            <div className="flex flex-col md:flex-row">
                {/* Room Image */}
                <div className="relative w-full md:w-48 h-40 md:h-auto flex-shrink-0">
                    <Image
                        src={roomImage}
                        alt={roomName}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Room Details */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                        {/* Room Name */}
                        <h3 className="font-semibold text-lg">{roomName}</h3>

                        {/* Room Features */}
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Bed className="h-4 w-4" /> {bedType}
                            </span>
                            <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" /> Max {maxOccupancy}
                            </span>
                            {amenities.includes("WiFi") && (
                                <span className="flex items-center gap-1">
                                    <Wifi className="h-4 w-4" /> WiFi
                                </span>
                            )}
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mt-3">
                            {mealPlan && mealPlan !== "Room Only" && (
                                <Badge variant="secondary" className="text-xs">
                                    <Coffee className="h-3 w-3 me-1" />
                                    {mealPlan}
                                </Badge>
                            )}
                            {isRefundable ? (
                                <Badge
                                    variant="outline"
                                    className="text-xs text-green-600 border-green-600"
                                >
                                    <Check className="h-3 w-3 me-1" />
                                    Free Cancellation
                                </Badge>
                            ) : (
                                <Badge
                                    variant="outline"
                                    className="text-xs text-red-600 border-red-600"
                                >
                                    <X className="h-3 w-3 me-1" />
                                    Non-refundable
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Price & Select */}
                    <div className="flex items-end justify-between mt-4 pt-4 border-t">
                        <div>
                            <p className="text-2xl font-bold text-accent-600">
                                {formatPrice(pricePerNight)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                per night · {formatPrice(totalPrice)} total
                            </p>
                        </div>
                        <Button
                            variant={isSelected ? "default" : "outline"}
                            onClick={onSelect}
                            className={cn(
                                "min-w-[100px]",
                                isSelected &&
                                    "bg-accent-500 hover:bg-accent-600",
                            )}
                        >
                            {isSelected ? (
                                <>
                                    <Check className="h-4 w-4 me-1" />
                                    Selected
                                </>
                            ) : (
                                "Select"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
