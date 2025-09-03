"use client";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

const WIDTH = 70;
const HEIGHT = 70;

const SERVICES = [
  {
    title: "Flights",
    subTitle: "Over +500",
    src: "/icons/airplane.gif",
    path: "/flights",
    default: true,
  },
  {
    title: "Hotels",
    subTitle: "",
    src: "/icons/bed.gif",
    path: "/hotels",
    default: false,
  },
  {
    title: "Insurance",
    subTitle: "",
    src: "/icons/insurance.gif",
    path: "/insurance",
    default: false,
  },
  {
    title: "Cars",
    subTitle: "",
    src: "/icons/car.gif",
    path: "/cars",
    default: false,
  },
];

//  pathname = path

function ServicesNavigation() {
  const pathname = usePathname();
  const t = useTranslations("Services");
  return (
    <nav className="grid grid-cols-4 gap-8 mt-5 mb-3 px-6 ">
      {SERVICES.map((service) => (
        <Link
          key={service.title}
          href={service.path}
          className={`flex justify-center flex-col items-center md:flex-row gap-2  w-fit md:text-black p-2 rounded-2xl ${
            service.path == pathname
              ? "md:bg-accent-300"
              : service.path == "/flights" && pathname == "/"
              ? "md:bg-accent-300"
              : "md:bg-white"
          }`}
        >
          <Image
            src={service.src}
            alt={service.title}
            width={WIDTH}
            height={HEIGHT}
            className={`${
              service.path == pathname
                ? "bg-accent-300"
                : service.path == "/flights" && pathname == "/"
                ? "bg-accent-300"
                : "bg-white"
            } rounded-2xl p-2 md:p-0`}
          />
          <span className="font-semibold mt-1">{t(`${service.title}`)}</span>
        </Link>
      ))}
    </nav>
  );
}

export default ServicesNavigation;
