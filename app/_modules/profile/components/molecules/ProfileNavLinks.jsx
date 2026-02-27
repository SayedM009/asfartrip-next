"use client";
import { Link, usePathname } from "@/i18n/navigation";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Squares2X2Icon, UserGroupIcon } from "@heroicons/react/24/outline";
import {
    BedDouble,
    CalendarRange,
    Mail,
    Plane,
    Shield,
    UserIcon,
} from "lucide-react";

export default function ProfileNavLinks({ translations }) {
    const pathname = usePathname();

    const baseStyle =
        "flex items-center gap-5 text-xl p-2 rounded-lg transition-colors";
    const activeStyle = "bg-primary/10 text-primary font-semibold";
    const inactiveStyle = "hover:bg-gray-100 dark:hover:bg-gray-800";

    const isActive = (path) =>
        pathname === path || pathname.startsWith(path + "/");
    const getStyle = (path) =>
        `${baseStyle} ${isActive(path) ? activeStyle : inactiveStyle}`;

    // Check if any booking page is active (for accordion)
    const isBookingActive =
        isActive("/profile/hotels") ||
        isActive("/profile/flights") ||
        isActive("/profile/insurance");

    return (
        <div className="flex flex-col gap-3 mt-10">
            <Link
                href="/profile/dashboard"
                className={getStyle("/profile/dashboard")}
            >
                <Squares2X2Icon className="size-6" /> {translations.dashboard}
            </Link>
            <Link
                href="/profile/profile-info"
                className={getStyle("/profile/profile-info")}
            >
                <UserIcon className="size-6" /> {translations.personal_info}
            </Link>
            <Link
                href="/profile/travellers"
                className={getStyle("/profile/travellers")}
            >
                <UserGroupIcon className="size-6" /> {translations.travellers}
            </Link>

            <Accordion
                type="single"
                collapsible
                defaultValue={isBookingActive ? "bookings" : undefined}
                className="w-full"
            >
                <AccordionItem value="bookings" className="border-none">
                    <AccordionTrigger
                        className={`p-0 hover:no-underline ${isBookingActive ? "text-primary" : ""}`}
                    >
                        <div
                            className={`${baseStyle} ${isBookingActive ? activeStyle : inactiveStyle} w-full`}
                        >
                            <CalendarRange className="size-6" />{" "}
                            {translations.my_bookings}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-2 ps-6 pt-2">
                        <Link
                            href="/profile/hotels"
                            className={getStyle("/profile/hotels")}
                        >
                            <BedDouble className="size-5" />{" "}
                            {translations.hotels}
                        </Link>
                        <Link
                            href="/profile/flights"
                            className={getStyle("/profile/flights")}
                        >
                            <Plane className="size-5" /> {translations.flights}
                        </Link>
                        <Link
                            href="/profile/insurance"
                            className={getStyle("/profile/insurance")}
                        >
                            <Shield className="size-5" />{" "}
                            {translations.insurance}
                        </Link>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <Link
                href="/contact-us"
                className={`${baseStyle} ${inactiveStyle}`}
                target="_blank"
            >
                <Mail className="size-6" /> {translations.contact_support}
            </Link>
        </div>
    );
}
