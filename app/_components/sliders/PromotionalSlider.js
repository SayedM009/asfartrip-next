"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import Image from "next/image";
import useCheckLocal from "../../_hooks/useCheckLocal";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const offers = [
    { src: "/hot_offers/busisness.jpg", alt: "Travel to Egypt now" },
    { src: "/hot_offers/etihad.png", alt: "Travel to Egypt now" },
    { src: "/hot_offers/france.png", alt: "Travel to Egypt now" },
    { src: "/hot_offers/london.png", alt: "Travel to Egypt now" },
    { src: "/hot_offers/tabby.jpg", alt: "Travel to Egypt now" },
    { src: "/hot_offers/Egypt.jpg", alt: "Travel to Egypt now" },
    { src: "/hot_offers/Saudi.jpg", alt: "Travel to Saudi now" },
    { src: "/hot_offers/Turkey.jpg", alt: "Travel to Turkey now" },
    { src: "/hot_offers/UAE.jpg", alt: "Travel to UAE now" },
];

export function PromotionalSlider() {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const t = useTranslations("Offers_slider");
    const { isRTL } = useCheckLocal();

    const updateScrollButtons = () => {
        if (!scrollRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScrollLeft = scrollWidth - clientWidth;

        if (isRTL) {
            setCanScrollRight(Math.abs(scrollLeft) > 0);
            setCanScrollLeft(Math.abs(scrollLeft) < maxScrollLeft);
        } else {
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < maxScrollLeft);
        }
    };

    const scroll = (direction) => {
        if (!scrollRef.current) return;
        const scrollAmount = scrollRef.current.clientWidth * 0.9;
        const current = scrollRef.current.scrollLeft;

        const newPos =
            direction === "left"
                ? current - scrollAmount
                : current + scrollAmount;

        scrollRef.current.scrollTo({ left: newPos, behavior: "smooth" });
    };

    useEffect(() => {
        updateScrollButtons();
        const onResize = () => updateScrollButtons();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [isRTL]);

    return (
        <section className="mt-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 sm:mb-6 ">
                <div>
                    <div className="flex items-center sm:mb-1 gap-2">
                        <Image
                            src="/icons/gift.svg"
                            alt="offers"
                            width={22}
                            height={22}
                            priority
                        />
                        <h2 className="text-md sm:text-2xl font-bold text-foreground uppercase">
                            {t("title")}
                        </h2>
                    </div>
                    <p className="text-xs sm:text-lg text-muted-foreground">
                        {t("sub_title")}
                    </p>
                </div>

                {/* Desktop Arrows */}
                <div
                    className={cn(
                        "hidden sm:flex gap-2",
                        isRTL && "flex-row-reverse"
                    )}
                >
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={!canScrollLeft}
                        onClick={() => scroll("left")}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={!canScrollRight}
                        onClick={() => scroll("right")}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Slider */}
            <div className="relative">
                <div
                    ref={scrollRef}
                    className={cn(
                        "flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth pb-3",
                        "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                        isRTL ? "direction-rtl" : "direction-ltr"
                    )}
                    onScroll={updateScrollButtons}
                >
                    {offers.map((item, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 w-[80vw] sm:w-[350px] lg:w-[480px] aspect-[16/7] relative rounded-xl overflow-hidden"
                            style={{ scrollSnapAlign: "start" }}
                        >
                            <Image
                                src={item.src}
                                alt={item.alt}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 80vw, (max-width: 1200px) 350px, 480px"
                                priority={i === 0 ? true : undefined}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
