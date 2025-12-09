"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import WegoSearchFormDialog from "../_modules/flight/search/components/mobile-wego/WegoSearchFormDialog";

const WIDTH = 80;
const HEIGHT = 80;

function WegoServicesNavigation() {
    const t = useTranslations("Services");

    return (
        <nav className="flex items-center justify-around my-5 sm:my-8 gap-5">
            <motion.div
                key={"search"}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.3,
                    ease: "easeOut",
                }}
            >
                <WegoSearchFormDialog />
            </motion.div>

            <motion.div
                key={"hotels"}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.6,
                    ease: "easeOut",
                }}
            >
                <div className=" pointer-events-none text-center bg-background shadow-2xl dark:bg-gray-900 px-12 rounded-xl py-2">
                    <Image
                        src="/icons/wego-hotel.png"
                        alt="Perfect Stays"
                        width={WIDTH}
                        height={HEIGHT}
                        priority
                        fetchPriority="high"
                        loading="eager"
                        className="rounded-lg  md:p-0 aspect-square  "
                    />

                    <span className="font-bold text-center">{t(`Hotels`)}</span>
                </div>
            </motion.div>
        </nav>
    );
}

export default WegoServicesNavigation;
