"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { PlaneTakeoff, CalendarDays, Infinity } from "lucide-react";

const plansData = [
    {
        id: "single",
        icon: PlaneTakeoff,
        color: "from-yellow-400 to-yellow-200",
    },
    { id: "annual", icon: CalendarDays, color: "from-green-400 to-green-200" },
    { id: "biennial", icon: Infinity, color: "from-blue-400 to-blue-200" },
];

export default function PlansSection() {
    const t = useTranslations("InsurancePage.plans");

    return (
        <section className="py-16  mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-12 text-start"
            >
                <h2 className="text-3xl font-bold tracking-tight  mb-2 uppercase">
                    {t("title")}
                </h2>
                <p className="text-muted-foreground text-lg">{t("subtitle")}</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plansData.map((plan, index) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                            duration: 0.5,
                            delay: index * 0.2,
                            ease: "linear",
                        }}
                        className="relative p-1  border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all group overflow-hidden"
                    >
                        <div className="p-10 flex flex-col items-center text-center">
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

                            <div className="mb-6 p-5  rounded-2xl  group-hover:text-white transition-colors duration-300">
                                <div
                                    className={`flex items-center justify-center w-12 h-12 rounded-xl
              bg-gradient-to-br ${plan.color} bg-opacity-20`}
                                >
                                    <plan.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                                {t(`items.${plan.id}.title`)}
                            </h3>

                            <p className="text-muted-foreground leading-relaxed">
                                {t(`items.${plan.id}.desc`)}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
