"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Hotel image + name + star rating card for booking sidebar
 */
export default function HotelInfoCard({ hotelInfo }) {
    const t = useTranslations("Hotels.booking");

    if (!hotelInfo?.name) return null;

    const rating = parseInt(hotelInfo.rating) || 0;

    return (
        <div className="space-y-3">
            {/* Hotel Image */}
            {hotelInfo.image && (
                <div className="relative w-full h-36 rounded-xl overflow-hidden">
                    <Image
                        src={hotelInfo.image}
                        alt={hotelInfo.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 384px"
                    />
                </div>
            )}

            {/* Hotel Name + Rating */}
            <div>
                <h4 className="font-semibold text-sm text-primary-700 dark:text-primary-100 line-clamp-2">
                    {hotelInfo.name}
                </h4>
                {rating > 0 && (
                    <div className="flex items-center gap-0.5 mt-1">
                        {Array.from({ length: rating }).map((_, i) => (
                            <Star
                                key={i}
                                className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                            />
                        ))}
                    </div>
                )}
                {hotelInfo.address && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {hotelInfo.address}
                    </p>
                )}
            </div>
        </div>
    );
}
