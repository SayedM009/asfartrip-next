"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLocale, useTranslations } from "next-intl";
import StarRating from "../atoms/StarRating";
import PriceDisplay from "../atoms/PriceDisplay";
import PropertyTypeBadge from "../atoms/PropertyTypeBadge";
import { Button } from "@/components/ui/button";
import ChevronBasedOnLanguage from "@/app/_components/ui/ChevronBasedOnLanguage";

const NO_IMAGE = "/no-image.webp";
const MAX_IMAGES = 5;

/**
 * Hotel card component with side image slider (Trip.com style)
 * @param {Object} props
 * @param {Object} props.hotel - Hotel data object from API
 * @param {number} props.nights - Number of nights
 * @param {Object} props.details - Enriched hotel details (optional)
 */
export function HotelCard({ hotel, nights = 1, rooms = 1, details }) {
    const locale = useLocale();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageError, setImageError] = useState({});
    const t = useTranslations("Hotels.results");

    // Extract hotel info from API structure
    const hotelInfo = hotel?.HotelInfo || {};
    const hotelPrice = hotel?.HotelPrice || {};

    const hotelId = hotelInfo.Id;
    const name = hotelInfo.Name || "Hotel";
    const address = hotelInfo.Address || "";
    const starRating = hotelInfo.Rating;
    const tripAdvisorRating = hotelInfo.TripAdvisorRating;
    const propertyType = hotelInfo.PropertyType;
    const mainImage = hotelInfo.Picture;

    // Price info
    const minPrice = hotelPrice.MinPrice || 0;
    const priceBeforeDiscount = hotelPrice.PriceBeforeDiscount;
    const discountPercent = hotelPrice.DiscountPercent || 0;
    const currency = hotelPrice.Currency || "AED";

    // Get images from details or use main image
    const getImages = useCallback(() => {
        if (details?.Images) {
            const imagesObj = details.Images;
            const imagesArray = Object.values(imagesObj).slice(0, MAX_IMAGES);
            return imagesArray.length > 0 ? imagesArray : [mainImage];
        }
        return [mainImage].filter(Boolean);
    }, [details, mainImage]);

    const images = getImages();
    const hasMultipleImages = images.length > 1;

    // Image navigation
    const nextImage = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        },
        [images.length],
    );

    const prevImage = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            setCurrentImageIndex(
                (prev) => (prev - 1 + images.length) % images.length,
            );
        },
        [images.length],
    );

    // Handle image error
    const handleImageError = useCallback(() => {
        setImageError((prev) => ({ ...prev, [currentImageIndex]: true }));
    }, [currentImageIndex]);

    // Get current image src
    const getCurrentImageSrc = () => {
        if (imageError[currentImageIndex] || !images[currentImageIndex]) {
            return NO_IMAGE;
        }
        return images[currentImageIndex];
    };

    return (
        <Link href={`/${locale}/hotels/details/${hotelId}`}>
            <Card
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group border-0 shadow-none md:shadow-sm py-0 
            border-b md:border-b-0 border-gray-300 !rounded-b-none md:!rounded-b-xl pb-4 md:pb-0 bg-background
            "
            >
                <div className="flex flex-row">
                    {/* Image Slider - Side */}
                    <div className="relative w-[120px] sm:w-[180px] md:w-[220px] h-[250px] sm:h-[200px] md:h-auto aspect-square flex-shrink-0">
                        <Image
                            src={getCurrentImageSrc()}
                            alt={name}
                            fill
                            className="object-cover rounded-md md:rounded-none"
                            onError={handleImageError}
                            sizes="(max-width: 640px) 140px, (max-width: 768px) 180px, 220px"
                        />
                        {/* Image navigation arrows */}
                        {hasMultipleImages && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="size-4" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="size-4" />
                                </button>
                            </>
                        )}
                        {/* Image dots indicator */}
                        {hasMultipleImages && (
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                                {images.map((_, index) => (
                                    <span
                                        key={index}
                                        className={`size-1.5 rounded-full transition-colors ${
                                            index === currentImageIndex
                                                ? "bg-white"
                                                : "bg-white/50"
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                        {/* Property type badge */}
                        {propertyType && (
                            <div className="absolute top-2 left-2 rtl:left-auto rtl:right-2 z-1">
                                <PropertyTypeBadge type={propertyType} />
                            </div>
                        )}
                    </div>

                    {/* Hotel Info - Right side */}
                    <div className="flex-1 px-2 md:pb-4 md:px-4 flex flex-col justify-between min-w-0">
                        {/* Top section */}
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                {/* Hotel name */}
                                <h3 className="font-bold text-sm sm:text-base md:text-lg text-primary-900 dark:text-white line-clamp-1 mb-1 group-hover:text-accent-500 transition-colors">
                                    {name}
                                </h3>
                                {/* Star rating */}
                                <div className="mb-1">
                                    <StarRating rating={starRating} size="sm" />
                                </div>
                            </div>

                            {/* TripAdvisor rating */}
                            {tripAdvisorRating && (
                                <div className="flex items-center gap-1.5 text-xs sm:text-sm mb-2">
                                    <span className="bg-[#34e0a1] dark:bg-green-900 text-white px-1.5 py-0 rounded-full rounded-tr-none font-semibold">
                                        {tripAdvisorRating} / 5
                                    </span>

                                    <Image
                                        src="/hotels/owl.svg"
                                        alt="TripAdvisor"
                                        width={25}
                                        height={25}
                                    />
                                </div>
                            )}

                            {/* Address */}
                            <div className="flex items-start gap-1 text-xs sm:text-sm text-muted-foreground ">
                                <MapPin className="size-3 sm:size-4 flex-shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{address}</span>
                            </div>
                        </div>

                        {/* Bottom section - Price */}
                        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100 dark:border-gray-800">
                            <PriceDisplay
                                price={minPrice}
                                originalPrice={priceBeforeDiscount}
                                discountPercent={discountPercent}
                                nights={nights}
                                rooms={rooms}
                                currency={currency}
                            />
                        </div>
                        <Button className="text-xs sm:text-sm bg-accent-600 text-white w-fit self-end hover:bg-accent-700 hover:cursor-pointer rounded mt-2  items-center gap-2 hidden md:flex">
                            {t("check_availability")}
                            <ChevronBasedOnLanguage size="5" />
                        </Button>
                    </div>
                </div>
            </Card>
        </Link>
    );
}

export default HotelCard;
