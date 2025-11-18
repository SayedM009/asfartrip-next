"use client";

import { formatDisplayDate } from "@/app/_helpers/formatDisplayDate";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

export default function CancellationPage() {
    const t = useTranslations("CancellationPage");

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
                    <p className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400 mb-3">
                        {t("legal_label")}
                    </p>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl text-gray-900 dark:text-white tracking-tight mb-4">
                        {t("hero_title")}
                    </h1>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl">
                        {t("hero_subtitle")}
                    </p>
                    <p className="mt-4 text-xs md:text-sm text-gray-500 dark:text-gray-500">
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
            <section className="  space-y-8">
                {/* SECTION WRAPPER */}
                <PolicySection
                    title={t("sec_general_title")}
                    paragraphs={[
                        t("general_p1"),
                        t("general_p2"),
                        t("general_p3"),
                    ]}
                />

                <PolicySection
                    title={t("sec_lcc_title")}
                    paragraphs={[t("lcc_p1"), t("lcc_p2"), t("lcc_p3")]}
                    listTitle={t("lcc_list_title")}
                    listItems={[
                        t("lcc_item_1"),
                        t("lcc_item_2"),
                        t("lcc_item_3"),
                    ]}
                />

                <PolicySection
                    title={t("sec_fsc_title")}
                    paragraphs={[t("fsc_p1"), t("fsc_p2"), t("fsc_p3")]}
                />

                <PolicySection
                    title={t("sec_changes_title")}
                    paragraphs={[
                        t("changes_p1"),
                        t("changes_p2"),
                        t("changes_p3"),
                    ]}
                    listTitle={t("changes_list_title")}
                    listItems={[
                        t("changes_item_1"),
                        t("changes_item_2"),
                        t("changes_item_3"),
                        t("changes_item_4"),
                    ]}
                />

                <PolicySection
                    title={t("sec_void_title")}
                    paragraphs={[t("void_p1"), t("void_p2")]}
                    listTitle={t("void_list_title")}
                    listItems={[
                        t("void_item_1"),
                        t("void_item_2"),
                        t("void_item_3"),
                    ]}
                />

                <PolicySection
                    title={t("sec_refunds_title")}
                    paragraphs={[
                        t("refunds_p1"),
                        t("refunds_p2"),
                        t("refunds_p3"),
                    ]}
                    listTitle={t("refunds_list_title")}
                    listItems={[
                        t("refunds_item_1"),
                        t("refunds_item_2"),
                        t("refunds_item_3"),
                        t("refunds_item_4"),
                    ]}
                />

                <PolicySection
                    title={t("sec_noshow_title")}
                    paragraphs={[t("noshow_p1"), t("noshow_p2")]}
                    listTitle={t("noshow_list_title")}
                    listItems={[
                        t("noshow_item_1"),
                        t("noshow_item_2"),
                        t("noshow_item_3"),
                        t("noshow_item_4"),
                    ]}
                />

                <PolicySection
                    title={t("sec_unused_title")}
                    paragraphs={[t("unused_p1"), t("unused_p2")]}
                />

                <PolicySection
                    title={t("sec_legal_title")}
                    paragraphs={[t("legal_p1"), t("legal_p2"), t("legal_p3")]}
                    listTitle={t("legal_list_title")}
                    listItems={[
                        t("legal_item_1"),
                        t("legal_item_2"),
                        t("legal_item_3"),
                    ]}
                />
            </section>
        </div>
    );
}

function PolicySection({ title, paragraphs = [], listTitle, listItems = [] }) {
    if (!title) return null;

    return (
        <div className="py-3 sm:py-7 space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                {title}
            </h2>

            {paragraphs.map(
                (p, idx) =>
                    p && (
                        <p
                            key={idx}
                            className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed"
                        >
                            {p}
                        </p>
                    )
            )}

            {listTitle && listItems.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm md:text-base font-medium text-gray-900 dark:text-gray-100">
                        {listTitle}
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-sm md:text-base text-gray-700 dark:text-gray-300 list-inside">
                        {listItems.map(
                            (item, idx) => item && <li key={idx}>{item}</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
