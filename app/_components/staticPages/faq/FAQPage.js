"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { BedDouble, Plane, CircleHelp, ShieldPlus } from "lucide-react";

const TABS = [
    {
        id: "flights",
        labelKey: "tab_flights",
        icon: <Plane className="w-4 h-4" />,
    },
    {
        id: "hotels",
        labelKey: "tab_hotels",
        icon: <BedDouble className="w-4 h-4" />,
    },
    {
        id: "insurance",
        labelKey: "tab_insurance",
        icon: <ShieldPlus className="w-4 h-4" />,
    },
];

// ================ FLIGHTS GROUPED FAQ DATA ================
const flightGroups = [
    {
        id: "before",
        titleKey: "before_title",
        questions: [
            { id: "q1", qKey: "before_q1", aKey: "before_a1" },
            { id: "q2", qKey: "before_q2", aKey: "before_a2" },
            { id: "q3", qKey: "before_q3", aKey: "before_a3" },
        ],
    },
    {
        id: "after",
        titleKey: "after_title",
        questions: [
            { id: "q1", qKey: "after_q1", aKey: "after_a1" },
            { id: "q2", qKey: "after_q2", aKey: "after_a2" },
            { id: "q3", qKey: "after_q3", aKey: "after_a3" }, // هنا فيها 3 ساعات إصدار
        ],
    },
    {
        id: "payment",
        titleKey: "payment_title",
        questions: [
            { id: "q1", qKey: "payment_q1", aKey: "payment_a1" },
            { id: "q2", qKey: "payment_q2", aKey: "payment_a2" },
            { id: "q3", qKey: "payment_q3", aKey: "payment_a3" },
        ],
    },
    {
        id: "baggage",
        titleKey: "baggage_title",
        questions: [
            { id: "q1", qKey: "baggage_q1", aKey: "baggage_a1" },
            { id: "q2", qKey: "baggage_q2", aKey: "baggage_a2" },
            { id: "q3", qKey: "baggage_q3", aKey: "baggage_a3" },
        ],
    },
    {
        id: "changes",
        titleKey: "changes_title",
        questions: [
            { id: "q1", qKey: "changes_q1", aKey: "changes_a1" },
            { id: "q2", qKey: "changes_q2", aKey: "changes_a2" },
            { id: "q3", qKey: "changes_q3", aKey: "changes_a3" },
            // سؤال تعديل الاسم – اتنقل هنا عشان منطقيًا يتبع التغييرات
            { id: "q4", qKey: "changes_q4", aKey: "changes_a4" },
        ],
    },
    {
        id: "checkin",
        titleKey: "checkin_title",
        questions: [
            { id: "q1", qKey: "checkin_q1", aKey: "checkin_a1" },
            { id: "q2", qKey: "checkin_q2", aKey: "checkin_a2" },
            { id: "q3", qKey: "checkin_q3", aKey: "checkin_a3" },
        ],
    },
    {
        id: "requirements",
        titleKey: "requirements_title",
        questions: [
            { id: "q1", qKey: "requirements_q1", aKey: "requirements_a1" },
            { id: "q2", qKey: "requirements_q2", aKey: "requirements_a2" },
            { id: "q3", qKey: "requirements_q3", aKey: "requirements_a3" },
        ],
    },
    {
        id: "special",
        titleKey: "special_title",
        questions: [
            { id: "q1", qKey: "special_q1", aKey: "special_a1" },
            { id: "q2", qKey: "special_q2", aKey: "special_a2" },
        ],
    },
];

export default function FAQPage() {
    const t = useTranslations("FAQPage");
    const [activeTab, setActiveTab] = useState("flights");

    const renderFlightsContent = () => {
        return (
            <div className="  sm:px-6 space-y-6 mb-10">
                {flightGroups.map((group) => (
                    <Accordion
                        key={group.id}
                        type="single"
                        collapsible
                        className="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white/70 dark:bg-[#101012] shadow-sm"
                    >
                        {/* Parent accordion: المجموعة نفسها (Before booking / After booking...) */}
                        <AccordionItem value={group.id}>
                            <AccordionTrigger className="px-4 sm:px-6 text-left text-lg font-semibold text-gray-900 dark:text-white">
                                {t(group.titleKey)}
                            </AccordionTrigger>

                            <AccordionContent className="px-2 sm:px-4 pb-5 pt-1">
                                {/* SUB ACCORDION (Nested Accordion) */}
                                <Accordion
                                    type="multiple"
                                    className="space-y-3"
                                >
                                    {group.questions.map((q) => (
                                        <AccordionItem
                                            key={q.id}
                                            value={q.id}
                                            className="border rounded-xl px-3 sm:px-4 bg-gray-50 dark:bg-[#18181b] border-gray-200 dark:border-neutral-800"
                                        >
                                            <AccordionTrigger className="py-3 text-left text-gray-900 dark:text-gray-200 text-sm sm:text-base font-medium">
                                                {t(q.qKey)}
                                            </AccordionTrigger>

                                            <AccordionContent className="pb-4 text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
                                                {t(q.aKey)}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ))}
            </div>
        );
    };

    const renderComingSoon = (tab) => {
        return (
            <section className=" px-4 sm:px-6 pb-16">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-2xl border border-dashed border-gray-200 dark:border-neutral-800 bg-gray-50/60 dark:bg-[#101012] px-6 py-10 text-center"
                >
                    <p className="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-500 mb-2">
                        {t("coming_soon_badge")}
                    </p>
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-3">
                        {t("coming_soon_title", { tab: t(`tab_${tab}`) })}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                        {t("coming_soon_subtitle")}
                    </p>
                </motion.div>
            </section>
        );
    };

    return (
        <div className="transition-colors duration-300 mb-20 sm:mb-auto">
            {/* HERO */}
            <header className="relative overflow-hidden pt-8 pb-0 sm:py-14 mb-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center  px-4"
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white mb-4 tracking-tight">
                        {t("hero_title")}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        {t("hero_subtitle")}
                    </p>
                </motion.div>
            </header>

            {/* TABS */}
            <section className=" mb-8">
                <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2">
                    {TABS.map((tab) => {
                        const isActive = tab.id === activeTab;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={[
                                    "px-3 sm:px-6 py-2 rounded-full text-sm sm:text-base font-medium whitespace-nowrap border transition-all duration-200 flex items-center gap-2",
                                    isActive
                                        ? "bg-[#e86b1e] text-white border-[#e86b1e] shadow-sm"
                                        : "bg-gray-50 dark:bg-[#101012] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-neutral-800 hover:bg-gray-100 dark:hover:bg-[#18181b]",
                                ].join(" ")}
                            >
                                {tab.icon}
                                {t(tab.labelKey)}
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* CONTENT */}
            {activeTab === "flights"
                ? renderFlightsContent()
                : renderComingSoon(activeTab)}
        </div>
    );
}
