"use client";

import { Star } from "lucide-react";

/**
 * Star rating display component
 * @param {Object} props
 * @param {number} props.rating - Star rating (1-5)
 * @param {string} props.size - Size class (sm, md, lg)
 * @param {boolean} props.showEmpty - Show empty stars
 */
export default function StarRating({
    rating = 0,
    size = "sm",
    showEmpty = false,
}) {
    const stars = parseInt(rating) || 0;
    const maxStars = 5;

    const sizeClasses = {
        sm: "size-3",
        md: "size-4",
        lg: "size-5",
    };

    const sizeClass = sizeClasses[size] || sizeClasses.sm;

    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: showEmpty ? maxStars : stars }).map(
                (_, i) => (
                    <Star
                        key={i}
                        className={`${sizeClass} ${
                            i < stars
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                        }`}
                    />
                ),
            )}
        </div>
    );
}
