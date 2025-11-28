// app/_modules/offers/components/organisms/OffersGrid.jsx
"use client";
import OffersHeader from "../molecules/OffersHeader";
import OfferCard from "./OfferCard";
import { motion } from "framer-motion";

export default function OffersGrid({ offers }) {
    if (!offers?.length) return null;

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 space-y-6 pt-5 md:pt-auto pb-16">
            <div className="col-span-full hidden md:block">
                <OffersHeader />
            </div>

            {offers.map((offer, index) => (
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: (index + 1) * 0.3,
                        ease: "easeOut",
                    }}
                >
                    <OfferCard key={index} offer={offer} />
                </motion.div>
            ))}
        </div>
    );
}
