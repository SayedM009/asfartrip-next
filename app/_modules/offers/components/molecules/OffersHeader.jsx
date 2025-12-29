"use client";
import OffersSubTitle from "../atoms/OffersSubTitle";
import OffersTtile from "../atoms/OffersTtile";
import { motion } from "motion/react";
function OffersHeader() {
    return (
        <header className="sm:pt-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <OffersTtile />
                <OffersSubTitle />
            </motion.div>
        </header>
    );
}

export default OffersHeader;
