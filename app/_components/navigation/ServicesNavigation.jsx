"use client";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import Image from "next/image";
import clsx from "clsx";

const WIDTH = 70;
const HEIGHT = 70;

const SERVICES = [
    {
        title: "Flights",
        subTitle: "Book Flights",
        src: "/icons/airplane-m.gif",
        path: "/flights",
        default: false,
    },
    {
        title: "Hotels",
        subTitle: "Perfect Stays",
        src: "/icons/bed-m.gif",
        path: "/hotels",
        soon: false,
    },
    {
        title: "Insurance",
        subTitle: "Safe Trip",
        src: "/icons/insurance-m.gif",
        path: "/insurance",
        soon: false,
    },
];

function ServicesNavigation() {
    const pathname = usePathname();
    const t = useTranslations("Services");
    const { theme } = useTheme();
    const condition = theme === "dark";

    return (
        <nav className="flex items-center justify-between my-5 md:my-8">
            {SERVICES.map((service, index) => (
                <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: (index + 1) * 0.3,
                        ease: "easeOut",
                    }}
                >
                    <Link
                        href={service.path}
                        onClick={(e) => {
                            if (service.soon) {
                                e.preventDefault();
                            }
                        }}
                        className={clsx(
                            "flex justify-start flex-col md:min-w-40 items-center",
                            "md:flex-row gap-2 md:w-fit md:text-black md:p-2",
                            "rounded-2xl relative",

                            // ---- Active states ----
                            service.path === pathname && "md:bg-accent-400",

                            // ---- Inactive state ----
                            service.path !== pathname &&
                                "md:bg-gradient-to-b from-gray-300  ",

                            // ---- Disabled state ----
                            service.soon &&
                                "opacity-50 cursor-not-allowed select-none",
                        )}
                    >
                        <div className="relative pointer-events-none">
                            <Image
                                src={service.src}
                                alt={service.subTitle}
                                width={WIDTH}
                                height={HEIGHT}
                                priority
                                fetchPriority="high"
                                loading="eager"
                                className={clsx(
                                    // Shared styles
                                    "rounded-lg p-2.5 md:p-0 aspect-square",

                                    // Active: exact match
                                    service.path === pathname &&
                                        "bg-accent-400",
                                )}
                                unoptimized
                            />

                            {service.soon && (
                                <span className="absolute -bottom-2.5 right-[50%] translate-x-1/2 md:top-0 md:bottom-auto md:-right-[100%] md:rtl:-left-[150%] md:rtl:right-auto   px-1.5 py-0.5 text-xs font-semibold rounded-full text-white animate-pulse bg-gradient-to-r from-amber-500 via-pink-500 to-purple-500">
                                    {t("soon")}
                                </span>
                            )}
                        </div>

                        <div
                            className={`mt-1 flex flex-col pointer-events-none ${
                                service.path === pathname
                                    ? "md:text-white"
                                    : "text-black dark:text-white"
                            }`}
                        >
                            <span className="font-bold ">
                                {t(`${service.title}`)}
                            </span>
                            <span className="text-[10px] hidden md:block ">
                                {t(`${service.title}_sub_title`)}
                            </span>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </nav>
    );
}

export default ServicesNavigation;
