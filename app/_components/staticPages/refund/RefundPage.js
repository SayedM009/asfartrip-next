"use client";

import { formatDisplayDate } from "@/app/_helpers/formatDisplayDate";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

export default function RefundPage() {
    const t = useTranslations("RefundPage");

    const lastUpdated = t("last_updated", {
        date: formatDisplayDate(
            new Date("Tue Nov 18 2025 16:41:56 GMT+0400 (Gulf Standard Time)"),
            {
                pattern: "EEEE, d MMMM YYY",
            }
        ),
    });

    return (
        <div className="transition-colors duration-300 mb-20 sm:mb-auto">
            {/* HERO */}
            <header className="relative overflow-hidden py-5 lg:py-10 mb-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
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
            <section className=" pb-16 space-y-10">
                {/* 1. INTRO */}
                <Section title={t("sec_intro_title")}>
                    <p className="mb-3 text-muted-foreground">
                        {t("intro_p1")}
                    </p>
                    <p className="mb-3 text-muted-foreground">
                        {t("intro_p2")}
                    </p>
                    <p className="text-muted-foreground">{t("intro_p3")}</p>
                </Section>

                {/* 2. GENERAL RULES */}
                <Section title={t("sec_general_title")}>
                    <p className="mb-3 text-muted-foreground">
                        {t("general_p1")}
                    </p>
                    <p className="mb-4 text-muted-foreground">
                        {t("general_p2")}
                    </p>
                    <ul className="list-disc ps-6 space-y-2 text-muted-foreground">
                        <li>{t("general_li1")}</li>
                        <li>{t("general_li2")}</li>
                        <li>{t("general_li3")}</li>
                    </ul>
                </Section>

                {/* 3. FEES */}
                <Section title={t("sec_fees_title")}>
                    <p className="mb-4 text-muted-foreground">{t("fees_p1")}</p>
                    <ul className="list-disc ps-6 space-y-2 text-muted-foreground">
                        <li>{t("fees_li1")}</li>
                        <li>{t("fees_li2")}</li>
                    </ul>
                    <p className="mt-4 text-muted-foreground">{t("fees_p2")}</p>
                </Section>

                {/* 4. VOID */}
                <Section title={t("sec_void_title")}>
                    <p className="mb-3 text-muted-foreground">{t("void_p1")}</p>
                    <p className="text-muted-foreground">{t("void_p2")}</p>
                </Section>

                {/* 5. NON-REFUNDABLE */}
                <Section title={t("sec_nonref_title")}>
                    <p className="mb-3 text-muted-foreground">
                        {t("nonref_p1")}
                    </p>
                    <ul className="list-disc ps-6 space-y-2 text-muted-foreground">
                        <li>{t("nonref_li1")}</li>
                        <li>{t("nonref_li2")}</li>
                        <li>{t("nonref_li3")}</li>
                        <li>{t("nonref_li4")}</li>
                        <li>{t("nonref_li5")}</li>
                        <li>{t("nonref_li6")}</li>
                    </ul>
                </Section>

                {/* 6. TIMELINE */}
                <Section title={t("sec_timeline_title")}>
                    <p className="mb-3 text-muted-foreground">
                        {t("timeline_p1")}
                    </p>
                    <p className="text-muted-foreground">{t("timeline_p2")}</p>
                </Section>

                {/* 7. AMOUNT */}
                <Section title={t("sec_amount_title")}>
                    <p className="mb-3 text-muted-foreground">
                        {t("amount_p1")}
                    </p>
                    <p className="text-muted-foreground">{t("amount_p2")}</p>
                </Section>

                {/* 8. PROCESS */}
                <Section title={t("sec_process_title")}>
                    <p className="mb-3 text-muted-foreground">
                        {t("process_p1")}
                    </p>
                    <ul className="list-disc ps-6 space-y-2 text-muted-foreground">
                        <li>{t("process_li1")}</li>
                        <li>{t("process_li2")}</li>
                        <li>{t("process_li3")}</li>
                    </ul>
                </Section>

                {/* 9. LIABILITY */}
                <Section title={t("sec_liability_title")}>
                    <p className="mb-3 text-muted-foreground">
                        {t("liability_p1")}
                    </p>
                    <p className="mb-3 text-muted-foreground">
                        {t("liability_p2")}
                    </p>
                    <p className="text-muted-foreground">{t("liability_p3")}</p>
                </Section>
            </section>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="space-y-3">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">
                {title}
            </h2>
            <div className="text-sm md:text-base leading-relaxed space-y-3">
                {children}
            </div>
        </div>
    );
}
