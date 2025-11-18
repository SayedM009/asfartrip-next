"use client";

import { formatDisplayDate } from "@/app/_helpers/formatDisplayDate";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

export default function PrivacyPage() {
    const t = useTranslations("PrivacyPage");

    const lastUpdated = t("last_updated", {
        date: formatDisplayDate(
            new Date("Tue Nov 18 2025 16:41:56 GMT+0400 (Gulf Standard Time)"),
            {
                pattern: "EEEE, d MMMM YYY",
            }
        ),
    });

    const sections = [
        {
            id: "intro",
            title: t("sec_intro_title"),
            paragraphs: [t("intro_p1"), t("intro_p2"), t("intro_p3")],
        },
        {
            id: "scope",
            title: t("sec_scope_title"),
            paragraphs: [t("scope_p1"), t("scope_p2")],
        },
        {
            id: "info",
            title: t("sec_info_title"),
            paragraphs: [
                t("info_p1"),
                t("info_p2"),
                t("info_p3"),
                t("info_p4"),
            ],
        },
        {
            id: "use",
            title: t("sec_use_title"),
            paragraphs: [
                t("use_p1"),
                t("use_p2"),
                t("use_p3"),
                t("use_p4"),
                t("use_p5"),
                t("use_p6"),
            ],
        },
        {
            id: "share",
            title: t("sec_share_title"),
            paragraphs: [
                t("share_p1"),
                t("share_p2"),
                t("share_p3"),
                t("share_p4"),
                t("share_p5"),
            ],
        },
        {
            id: "payments",
            title: t("sec_payments_title"),
            paragraphs: [
                t("pay_p1"),
                t("pay_p2"),
                t("pay_p3"),
                t("pay_p4"),
                t("pay_p5"),
            ],
        },
        {
            id: "retention",
            title: t("sec_retention_title"),
            paragraphs: [t("retention_p1"), t("retention_p2")],
        },
        {
            id: "marketing",
            title: t("sec_marketing_title"),
            paragraphs: [
                t("marketing_p1"),
                t("marketing_p2"),
                t("marketing_p3"),
            ],
        },
        {
            id: "rights",
            title: t("sec_rights_title"),
            paragraphs: [t("rights_p1"), t("rights_p2")],
        },
        {
            id: "thirdparty",
            title: t("sec_thirdparty_title"),
            paragraphs: [t("third_p1")],
        },
        {
            id: "children",
            title: t("sec_children_title"),
            paragraphs: [t("children_p1")],
        },
        {
            id: "updates",
            title: t("sec_updates_title"),
            paragraphs: [t("update_p1")],
        },
        {
            id: "contact",
            title: t("sec_contact_title"),
            paragraphs: [t("contact_p1"), t("contact_p2")],
        },
    ];

    return (
        <div className="transition-colors duration-300 mb-20 sm:mb-auto">
            {/* HERO */}
            <header className="bg-gradient-to-br from-orange-50/50 via-white to-background dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 pt-7 mb-10 sm:py-14 ">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-4"
                >
                    <p className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-500 mb-2">
                        {t("legal_label")}
                    </p>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl text-gray-900 dark:text-white tracking-tight mb-4">
                        {t("hero_title")}
                    </h1>

                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl">
                        {t("hero_subtitle")}
                    </p>

                    <p className="mt-4 text-xs md:text-sm text-gray-500 dark:text-gray-500">
                        {lastUpdated}
                    </p>
                </motion.div>
            </header>

            {/* CONTENT */}
            <section className="  ">
                {sections.map((section) => (
                    <div key={section.id} className="py-5 sm:py-7 space-y-2">
                        <h2 className="text-xl md:text-2xl font-semibold text-foreground">
                            {section.title}
                        </h2>
                        {section.paragraphs.map((p, i) => (
                            <p
                                key={i}
                                className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line"
                            >
                                {p}
                            </p>
                        ))}
                    </div>
                ))}
            </section>
        </div>
    );
}
