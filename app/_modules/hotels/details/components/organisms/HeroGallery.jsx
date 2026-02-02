"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, Grid3X3, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel";

/**
 * Hero gallery for hotel images
 */
export default function HeroGallery({ images = [], hotelName }) {
    const [showModal, setShowModal] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [api, setApi] = useState(null);

    const displayImages = images.slice(0, 5);
    const remainingCount = images.length - 5;

    // Sync carousel with currentIndex when modal opens
    useEffect(() => {
        if (api && showModal) {
            api.scrollTo(currentIndex);
        }
    }, [api, showModal, currentIndex]);

    // Track current slide
    useEffect(() => {
        if (!api) return;

        const onSelect = () => {
            setCurrentIndex(api.selectedScrollSnap());
        };

        api.on("select", onSelect);
        return () => api.off("select", onSelect);
    }, [api]);

    // Mobile navigation
    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <>
            {/* Desktop Gallery Grid */}
            <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[300px] rounded-sm overflow-hidden">
                {/* Main Image */}
                <div
                    className="col-span-2 row-span-2 relative cursor-pointer group"
                    onClick={() => {
                        setCurrentIndex(0);
                        setShowModal(true);
                    }}
                >
                    <Image
                        src={displayImages[0] || "/no-image.webp"}
                        alt={hotelName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        priority
                    />
                </div>

                {/* Thumbnail Grid */}
                {displayImages.slice(1, 5).map((img, idx) => (
                    <div
                        key={idx}
                        className="relative cursor-pointer group"
                        onClick={() => {
                            setCurrentIndex(idx + 1);
                            setShowModal(true);
                        }}
                    >
                        <Image
                            src={img || "/no-image.webp"}
                            alt={`${hotelName} - ${idx + 2}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Show remaining count on last thumbnail */}
                        {idx === 3 && remainingCount > 0 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-white text-lg font-semibold flex items-center gap-2">
                                    <Grid3X3 className="h-5 w-5" />+
                                    {remainingCount}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Mobile Gallery Swiper with Touch Support */}
            <div className="md:hidden relative h-[280px] -mx-4 -top-4">
                <Carousel
                    opts={{
                        loop: true,
                    }}
                    className="h-full"
                    setApi={(mobileApi) => {
                        if (mobileApi) {
                            mobileApi.on("select", () => {
                                setCurrentIndex(mobileApi.selectedScrollSnap());
                            });
                        }
                    }}
                >
                    <CarouselContent className="h-full -ml-0">
                        {images.map((img, idx) => (
                            <CarouselItem key={idx} className="h-full pl-0">
                                <div className="relative h-[280px]">
                                    <Image
                                        src={img || "/no-image.webp"}
                                        alt={`${hotelName} - ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                        priority={idx === 0}
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>

                {/* Counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 z-10">
                    <ImageIcon className="size-4 mr-1" />
                    {`${currentIndex + 1}`.padStart(2, "0")} /{" "}
                    {`${images.length}`.padStart(2, "0")}
                </div>
            </div>

            {/* Full Screen Gallery Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="max-w-[95vw]  p-0 bg-black border-none ">
                    <DialogTitle className="sr-only">
                        {hotelName} Gallery
                    </DialogTitle>

                    {/* Close Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                        onClick={() => setShowModal(false)}
                    >
                        <X className="h-6 w-6" />
                    </Button>

                    {/* Main Image */}
                    <div className="relative w-full h-[80vh]">
                        <Image
                            src={images[currentIndex] || "/no-image.webp"}
                            alt={`${hotelName} - ${currentIndex + 1}`}
                            fill
                            className="object-contain"
                        />

                        {/* Navigation */}
                        <button
                            onClick={() =>
                                setCurrentIndex((prev) =>
                                    prev === 0 ? images.length - 1 : prev - 1,
                                )
                            }
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3"
                        >
                            <ChevronLeft className="h-8 w-8 text-white" />
                        </button>
                        <button
                            onClick={() =>
                                setCurrentIndex((prev) =>
                                    prev === images.length - 1 ? 0 : prev + 1,
                                )
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3"
                        >
                            <ChevronRight className="h-8 w-8 text-white" />
                        </button>
                    </div>

                    {/* Counter */}
                    <div className="text-center text-white py-2 bg-black">
                        {currentIndex + 1} / {images.length}
                    </div>

                    {/* Thumbnail Strip */}
                    <div className="flex gap-2 p-4 overflow-x-auto bg-black/80">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={cn(
                                    "flex-shrink-0 relative w-20 h-14 rounded overflow-hidden border-2",
                                    idx === currentIndex
                                        ? "border-white"
                                        : "border-transparent opacity-50",
                                )}
                            >
                                <Image
                                    src={img || "/no-image.webp"}
                                    alt={`Thumbnail ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
