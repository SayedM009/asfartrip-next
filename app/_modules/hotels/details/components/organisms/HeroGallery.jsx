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

            {/* Mobile Gallery Swiper */}
            <div className="md:hidden relative h-[280px] -mx-4 -top-4">
                <Image
                    src={images[currentIndex] || "/no-image.webp"}
                    alt={hotelName}
                    fill
                    className="object-cover"
                    priority
                />

                {/* Navigation Arrows */}
                <button
                    onClick={handlePrevious}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>

                {/* Counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <ImageIcon className="size-4 mr-1" />
                    {`${currentIndex + 1}`.padStart(2, "0")} /{" "}
                    {`${images.length}`.padStart(2, "0")}
                </div>
            </div>

            {/* Full Screen Gallery Modal with Carousel */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black border-none">
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

                    {/* Carousel */}
                    <div className="w-full h-[85vh] flex flex-col">
                        <Carousel
                            setApi={setApi}
                            opts={{
                                loop: true,
                                startIndex: currentIndex,
                            }}
                            className="flex-1"
                        >
                            <CarouselContent className="h-full">
                                {images.map((img, idx) => (
                                    <CarouselItem
                                        key={idx}
                                        className="h-full flex items-center justify-center"
                                    >
                                        <div className="relative w-full h-[70vh]">
                                            <Image
                                                src={img || "/no-image.webp"}
                                                alt={`${hotelName} - ${idx + 1}`}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            {/* Navigation Arrows */}
                            <CarouselPrevious className="left-4 bg-white/20 hover:bg-white/40 border-none text-white" />
                            <CarouselNext className="right-4 bg-white/20 hover:bg-white/40 border-none text-white" />
                        </Carousel>

                        {/* Counter */}
                        <div className="text-center text-white py-2">
                            {currentIndex + 1} / {images.length}
                        </div>

                        {/* Thumbnail Strip */}
                        <div className="flex gap-2 p-4 overflow-x-auto bg-black/80">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setCurrentIndex(idx);
                                        api?.scrollTo(idx);
                                    }}
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
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
