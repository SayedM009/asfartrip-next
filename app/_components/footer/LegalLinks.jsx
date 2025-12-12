"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const important_links = [
    { title: "terms_conditions", path: "/terms-and-conditions" },
    { title: "privacy_policy", path: "/privacy-policy" },
    { title: "cancellation_policy", path: "/cancellation-policy" },
    { title: "refund_policy", path: "/refund-policy" },
];

export default function LegalLinks() {
    const p = useTranslations("Pages");
    const t = useTranslations("Footer");

    return (
        <div>
            <h3 className="text-foreground mb-4 font-semibold text-lg">
                {t("legal.title")}
            </h3>
            <ul className="space-y-2 text-sm">
                {important_links.map((link) => (
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
