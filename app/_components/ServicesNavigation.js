"use client";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";

const WIDTH = 60;
const HEIGHT = 60;

const SERVICES = [
    {
        title: "Flights",
        subTitle: "Book Flights",
        // src: "/icons/airplane-m.gif",
        src: "/icons/airplane.svg",
        path: "/flights",
        default: true,
    },
    {
        title: "Hotels",
        subTitle: "Perfect Stays",
        // src: "/icons/bed-m.gif",
        src: "/icons/bed.svg",
        path: "/hotels",
        default: false,
    },
    {
        title: "Insurance",
        subTitle: "Safe Trip",
        // src: "/icons/insurance-m.gif",
        src: "/icons/insurance.svg",
        path: "/insurance",
        default: false,
    },
    {
        title: "Cars",
        subTitle: "Rent Vehicles",
        // src: "/icons/car-m.gif",
        src: "/icons/car.svg",
        path: "/cars",
        default: false,
    },
];

function ServicesNavigation() {
    const pathname = usePathname();
    const t = useTranslations("Services");
    const { theme } = useTheme();
    const condition = theme === "dark";
    return (
        <nav className="flex items-center justify-between my-5 sm:my-8">
            {SERVICES.map((service) => (
                <Link
                    key={service.title}
                    href={service.path}
                    className={`flex justify-start flex-col sm:min-w-40 items-center md:flex-row gap-2  md:w-fit md:text-black md:p-2 rounded-2xl ${
                        service.path == pathname
                            ? "md:bg-accent-400"
                            : service.path == "/flights" && pathname == "/"
                            ? "md:bg-accent-400"
                            : "md:bg-gradient-to-b to-gray-300 from-white"
                    }`}
                >
                    <Image
                        src={service.src}
                        alt={service.subTitle}
                        width={WIDTH}
                        height={HEIGHT}
                        // unoptimized
                        priority
                        fetchPriority="high"
                        loading="eager"
                        className={`${
                            service.path == pathname
                                ? "bg-accent-400"
                                : service.path == "/flights" && pathname == "/"
                                ? "bg-accent-400"
                                : `bg-gradient-to-b ${
                                      condition
                                          ? " from-gray-100"
                                          : " to-gray-300 from-white"
                                  }`
                        } rounded-lg p-2.5 md:p-0 aspect-square`}
                    />

                    <div className=" mt-1 flex flex-col ">
                        <span className="font-semibold">
                            {t(`${service.title}`)}
                        </span>
                        <span className="text-[10px]  hidden sm:block">
                            {t(`${service.title}_sub_title`)}
                        </span>
                    </div>
                </Link>
            ))}
        </nav>
    );
}

export default ServicesNavigation;
