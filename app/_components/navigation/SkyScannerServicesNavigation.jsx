"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import SkyScannerSearchFormDialog from "@/app/_modules/flight/search/components/mobile-skyscanner/SkyScannerSearchFormDialog";
import { BedDouble } from "lucide-react";
import InsuranceDialog from "@/app/_modules/insurance/components/templates/InsuranceDialog";
import HotelSearchDialog from "@/app/_modules/hotels/search/components/organisms/HotelSearchDialog";

function SkyScannerServicesNavigation() {
    const t = useTranslations("Services");

    return (
        <nav className="flex items-center justify-around  sm:my-8 gap-5">
            <motion.div
                key={"search"}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.3,
                    ease: "easeOut",
                }}
            >
                <SkyScannerSearchFormDialog />
            </motion.div>

            <motion.div
                key={"hotels"}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.5,
                    ease: "easeOut",
                }}
            >
                <HotelSearchDialog />
            </motion.div>
            <motion.div
                key={"insurance"}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.7,
                    ease: "easeOut",
                }}
            >
                <InsuranceDialog />
            </motion.div>
        </nav>
    );
}

export default SkyScannerServicesNavigation;
