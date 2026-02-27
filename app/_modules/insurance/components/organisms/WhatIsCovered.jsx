"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { HeartPulse, Briefcase, Ban, Globe } from "lucide-react";

const coverageItems = [
    { id: "medical", icon: HeartPulse, color: "from-red-400 to-red-200" },
    { id: "luggage", icon: Briefcase, color: "from-green-400 to-green-200" },
    { id: "cancellation", icon: Ban, color: "from-red-600 to-red-400" },
    { id: "repatriation", icon: Globe, color: "from-blue-400 to-blue-200" },
];

export default function WhatIsCovered() {
    const t = useTranslations("InsurancePage.coverage");

    return (
        <section className="py-16 ">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <h2 className="text-3xl font-bold mb-4">{t("title")}</h2>
                    <p className="text-muted-foreground max-w-2xl ">
                        {t("subtitle")}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {coverageItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className=" p-6 rounded-xl border border-slate-100 flex flex-col items-center text-center shadow-sm"
                        >
                            <div
                                className={`flex items-center justify-center w-12 h-12 rounded-xl mb-4
                                    bg-gradient-to-br ${item.color} bg-opacity-20`}
                            >
                                <item.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-bold mb-2">
                                {t(`items.${item.id}.title`)}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {t(`items.${item.id}.desc`)}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
