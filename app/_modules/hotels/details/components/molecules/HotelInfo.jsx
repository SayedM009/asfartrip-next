"use client";

import { Star, MapPin } from "lucide-react";
import TripAdvRating from "./TripAdvRating";

/**
 * Hotel info section with name, rating, and address
 */
export default function HotelInfo({
    name,
    starRating,
    tripAdvisorRating,
    address,
    cityName,
    countryName,
}) {
    const stars = parseInt(starRating) || 0;

    return (
        <div className="py-0 md:py-4 space-y-2">
            {/* Star Rating */}

            <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold">{name}</h1>
                {[...Array(stars)].map((_, i) => (
                    <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                ))}
            </div>

            {/* Hotel Name */}

            {/* Location */}
            <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                    {cityName}, {countryName}
                </span>
            </div>
        </div>
    );
}
