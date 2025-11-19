"use client";

import { useRef, useState, useEffect } from "react";
import SliderCard from "../molecules/SliderCard";
import SliderArrow from "../atoms/SliderArrow";
import { cn } from "@/lib/utils";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import { useLocale, useTranslations } from "next-intl";
import { offers } from "../../data/offersData";

export default function PromotionalSlider() {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const locale = useLocale();
    const { isRTL } = useCheckLocal();
    const t = useTranslations("Offers_slider");

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

        const amount = scrollRef.current.clientWidth * 0.9;
        const current = scrollRef.current.scrollLeft;

        const newPos =
            direction === "left" ? current - amount : current + amount;

        scrollRef.current.scrollTo({ left: newPos, behavior: "smooth" });
    };

    useEffect(() => {
        updateScrollButtons();
        window.addEventListener("resize", updateScrollButtons);
        return () => window.removeEventListener("resize", updateScrollButtons);
    }, [isRTL]);

    return (
        <section className="mt-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 sm:mb-6">
                <div>
                    <h2 className="text-md sm:text-2xl font-bold uppercase">
                        {t("title")}
                    </h2>
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
                    <SliderArrow
                        direction="left"
                        disabled={!canScrollLeft}
                        onClick={() => scroll("left")}
                    />
                    <SliderArrow
                        direction="right"
                        disabled={!canScrollRight}
                        onClick={() => scroll("right")}
                    />
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
                    {offers.map((offer) => (
                        <SliderCard
                            key={offer.id}
                            offer={offer}
                            locale={locale}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
