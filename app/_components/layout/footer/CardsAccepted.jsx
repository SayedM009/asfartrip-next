"use client";

// import { WebsiteConfigContext } from "@/app/_modules/config";
import Image from "next/image";
// import { useContext } from "react";

export default function CardsAccepted({ size = 30 }) {
    // const {cards_accepted, ...other} = useContext(WebsiteConfigContext)
    return (
        <div className="flex items-center gap-3">
            {/* {cards_accepted.map((card, index) => (
                <Image
                    key={index}
                    src={`/currencies/${card.image}`}
                    alt={card.image}
                    width={size}
                    height={size}
                    quality={100}
                />
            ))} */}
        </div>
    );
}
