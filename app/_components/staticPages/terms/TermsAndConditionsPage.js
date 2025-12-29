"use client";

import { formatDisplayDate } from "@/app/_helpers/formatDisplayDate";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

const SECTIONS = [
    {
        id: "introduction",
        titleKey: "sec_intro_title",
        paragraphKeys: [
            "intro_p1",
            "intro_p2",
            "intro_p3",
            "intro_p4",
            "intro_p5",
        ],
    },
    {
        id: "role",
        titleKey: "sec_role_title",
        paragraphKeys: ["role_p1", "role_p2", "role_p3"],
    },
    {
        id: "use",
        titleKey: "sec_use_title",
        paragraphKeys: ["use_p1", "use_p2", "use_p3"],
    },
    {
        id: "booking",
        titleKey: "sec_booking_title",
        paragraphKeys: ["booking_p1", "booking_p2", "booking_p3"],
    },
    {
        id: "payments",
        titleKey: "sec_payments_title",
        paragraphKeys: [
            "payments_p1",
            "payments_p2",
            "payments_p3",
            "payments_p4",
            "payments_p5",
            "payments_p6",
        ],
    },
    {
        id: "unused",
        titleKey: "sec_unused_title",
        paragraphKeys: ["unused_p1", "unused_p2", "unused_p3"],
    },
    {
        id: "changes",
        titleKey: "sec_changes_title",
        paragraphKeys: ["changes_p1", "changes_p2", "changes_p3", "changes_p4"],
    },
    {
        id: "liability",
        titleKey: "sec_liability_title",
        paragraphKeys: [
            "liability_p1",
            "liability_p2",
            "liability_p3",
            "liability_p4",
        ],
    },
    {
        id: "content",
        titleKey: "sec_content_title",
        paragraphKeys: ["content_p1", "content_p2", "content_p3"],
    },
    {
        id: "conduct",
        titleKey: "sec_conduct_title",
        paragraphKeys: ["conduct_p1", "conduct_p2", "conduct_p3", "conduct_p4"],
    },
    {
        id: "security",
        titleKey: "sec_security_title",
        paragraphKeys: ["security_p1", "security_p2"],
    },
    {
        id: "vat",
        titleKey: "sec_vat_title",
        paragraphKeys: ["vat_p1", "vat_p2"],
    },
    {
        id: "privacy",
        titleKey: "sec_privacy_title",
        paragraphKeys: ["privacy_p1"],
    },
    {
        id: "notice",
        titleKey: "sec_notice_title",
        paragraphKeys: ["notice_p1"],
    },
    {
        id: "grievance",
        titleKey: "sec_grievance_title",
        paragraphKeys: ["grievance_p1", "grievance_p2"],
    },
];

export default function TermsAndConditionsPage() {
    const t = useTranslations("TermsPage");

    return (
        <div className="transition-colors duration-300 mb-20 sm:mb-24">
            {/* HERO */}
            <header className="pt-7 mb-10 sm:py-14 ">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className=""
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

                    <p className="mt-3 text-xs text-gray-500 dark:text-gray-500">
                        {t("last_updated", {
                            date: formatDisplayDate(
                                new Date(
                                    "Tue Nov 18 2025 16:41:56 GMT+0400 (Gulf Standard Time)"
                                ),
                                {
                                    pattern: "EEEE, d MMMM YYY",
                                }
                            ),
                        })}
                    </p>
                </motion.div>
            </header>

            {/* CONTENT */}
            <section className=" space-y-10">
                {SECTIONS.map((section) => (
                    <section
                        key={section.id}
                        id={section.id}
                        className="space-y-3 scroll-mt-32"
                    >
                        <h2 className="text-lg md:text-2xl font-semibold text-gray-900 dark:text-white">
                            {t(section.titleKey)}
                        </h2>

                        <div className="space-y-3 text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                            {section.paragraphKeys.map((key) => {
                                const text = t(key);
                                if (!text) return null;
                                return <p key={key}>{text}</p>;
                            })}
                        </div>
                    </section>
                ))}
            </section>
        </div>
    );
}
