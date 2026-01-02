"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import SkyScannerSearchFormDialog from "@/app/_modules/flight/search/components/mobile-skyscanner/SkyScannerSearchFormDialog";
import { BedDouble, Car, ShieldPlus } from "lucide-react";

const WIDTH = 60;
const HEIGHT = 60;

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
                <div className="flex flex-col  items-center gap-2 ">
                    <div className="bg-accent-500  p-4 rounded-full ">
                        <BedDouble className=" text-white" />
                    </div>

                    <span className="font-bold text-center">{t(`Hotels`)}</span>
                </div>
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
                <div className="flex flex-col  items-center gap-2 ">
                    <div className="bg-accent-500  p-4 rounded-full ">
                        <ShieldPlus className=" text-white" />
                    </div>

                    <span className="font-bold text-center">
                        {t(`Insurance`)}
                    </span>
                </div>
            </motion.div>
        </nav>
    );
}

export default SkyScannerServicesNavigation;
