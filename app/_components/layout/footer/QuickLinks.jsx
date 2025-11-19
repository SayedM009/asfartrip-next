"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const quick_links = [
    { title: "about_us", path: "/about-us" },
    { title: "contact_us", path: "/contact-us" },
    { title: "faqs", path: "/faqs" },
];

export default function QuickLinks() {
    const p = useTranslations("Pages");
    const t = useTranslations("Footer");

    return (
        <div>
            <h3 className="text-foreground mb-4 font-semibold text-lg">
                {t("company")}
            </h3>
            <ul className="space-y-2 text-sm">
                {quick_links.map((link) => (
                    <li key={link.path}>
                        <Link
                            href={link.path}
                            className="hover:text-foreground transition-colors"
                        >
                            {p(link.title)}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
