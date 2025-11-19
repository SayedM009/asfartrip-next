"use client";

import Image from "next/image";

const cards = [
    { src: "/currencies/visa.svg", alt: "Visa", w: 30, h: 30 },
    { src: "/currencies/mastercard.svg", alt: "Mastercard", w: 30, h: 30 },
    { src: "/currencies/maestro.svg", alt: "Maestro", w: 30, h: 30 },
    { src: "/currencies/mada.svg", alt: "Mada", w: 40, h: 40 },
    { src: "/currencies/jcb.svg", alt: "JCB", w: 25, h: 25 },
    { src: "/currencies/amex.svg", alt: "Amex", w: 30, h: 30 },
    { src: "/currencies/tabby.svg", alt: "Tabby", w: 30, h: 30 },
];

export default function PaymentIcons() {
    return (
        <div className="flex items-center gap-3">
            {cards.map((card) => (
                <Image
                    key={card.src}
                    src={card.src}
                    alt={card.alt}
                    width={card.w}
                    height={card.h}
                    quality={100}
                />
            ))}
        </div>
    );
}
