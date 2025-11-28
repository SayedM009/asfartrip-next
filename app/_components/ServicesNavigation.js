"use client";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import Image from "next/image";

const WIDTH = 60;
const HEIGHT = 60;

const SERVICES = [
    {
        title: "Flights",
        subTitle: "Book Flights",
        src: "/icons/airplane.svg",
        path: "/flights",
        default: true,
    },
    {
        title: "Hotels",
        subTitle: "Perfect Stays",
        src: "/icons/bed.svg",
        path: "/hotels",
        soon: true,
    },
    {
        title: "Insurance",
        subTitle: "Safe Trip",
        src: "/icons/insurance.svg",
        path: "/insurance",
        soon: true,
    },
    {
        title: "Cars",
        subTitle: "Rent Vehicles",
        src: "/icons/car.svg",
        path: "/cars",
        soon: true,
    },
];

function ServicesNavigation() {
    const pathname = usePathname();
    const t = useTranslations("Services");
    const { theme } = useTheme();
    const condition = theme === "dark";



    return (
        <nav className="flex items-center justify-between my-5 sm:my-8">
            {SERVICES.map((service, index) => (
                <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: (index + 1) * 0.3, ease: "easeOut" }}>
                    <Link
                        href={service.path}
                        onClick={(e) => {
                            if (service.soon) {
                                e.preventDefault();
                            }
                        }}
                        className={`flex justify-start flex-col sm:min-w-40 items-center 
                        md:flex-row gap-2 md:w-fit md:text-black md:p-2 rounded-2xl relative
                        ${service.path == pathname
                                ? "md:bg-accent-400"
                                : service.path == "/flights" && pathname == "/"
                                    ? "md:bg-accent-400"
                                    : "md:bg-gradient-to-b to-gray-200 from-white"
                            } ${service.soon ? "opacity-50 cursor-not-allowed select-none" : ""}`}>
                        <div className="relative pointer-events-none">
                            <Image
                                src={service.src}
                                alt={service.subTitle}
                                width={WIDTH}
                                height={HEIGHT}
                                priority
                                fetchPriority="high"
                                loading="eager"
                                className={`${service.path == pathname
                                    ? "bg-accent-400"
                                    : service.path == "/flights" &&
                                        pathname == "/"
                                        ? "bg-accent-400"
                                        : `bg-gradient-to-b ${condition
                                            ? "from-gray-100"
                                            : "to-gray-200 from-white"
                                        }`
                                    } rounded-lg p-2.5 md:p-0 aspect-square`}
                            />

                            {service.soon && (
                                <span className="absolute -bottom-2.5 right-3.5 sm:top-0 sm:bottom-auto sm:-right-25 sm:rtl:-left-25 sm:rtl:right-auto   px-1 py-0.5 text-xs font-semibold rounded-full text-white animate-pulse bg-gradient-to-r from-amber-500 via-pink-500 to-purple-500">
                                    {t("soon")}
                                </span>
                            )}
                        </div>

                        <div className="mt-1 flex flex-col pointer-events-none">
                            <span className="font-semibold">
                                {t(`${service.title}`)}
                            </span>
                            <span className="text-[10px] hidden sm:block">
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
