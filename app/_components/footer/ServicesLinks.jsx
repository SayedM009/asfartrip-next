"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const services = [
    { title: "flight", path: "/flights" },
    { title: "hotel", path: "/hotels" },
    { title: "insurance", path: "/insurance" },
    { title: "offers", path: "/offers" },
];

export default function ServicesLinks() {
    const t = useTranslations("Footer");

    return (
        <div>
            <h3 className="text-foreground mb-4 font-semibold text-lg">
                {t("services.title")}
            </h3>
            <ul className="space-y-2 text-sm">
                {services.map((service) => (
                    <li key={service.path}>
                        <Link
                            href={service.path}
                            className="hover:text-foreground transition-colors"
                        >
                            {t(`services.${service.title}`)}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
