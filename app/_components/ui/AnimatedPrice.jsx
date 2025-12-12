"use client";
import React from "react";
import CountUp from "@/components/CountUp";
import Image from "next/image";
import { useCurrency } from "@/app/_modules/currency/hooks/useCurrency";

export default function AnimatedPrice({
    basePrice,
    delay = 0,
    duration = 2,
    color = "orange",
    size = 15,
    className = "",
}) {
    const { convertPrice, currentCurrency } = useCurrency();

    const converted = convertPrice(basePrice);

    const isImageCurrency =
        currentCurrency === "AED" || currentCurrency === "SAR";
    const iconSrc = `/currencies/${color}/${currentCurrency === "AED" ? "uae.svg" : "saudi.svg"
        }`;

    return (
        <div className={`inline-flex items-center gap-1 ${className}`}>
            <CountUp
                from={0}
                to={converted}
                duration={duration}
                delay={delay}
                separator=","
                className="font-semibold"
            />
            {isImageCurrency ? (
                <Image
                    src={iconSrc}
                    alt={currentCurrency}
                    width={size}
                    height={size}
                    className="inline-block"
                />
            ) : (
                <span className="ml-1 text-sm font-medium">
                    {currentCurrency}
                </span>
            )}
        </div>
    );
}
