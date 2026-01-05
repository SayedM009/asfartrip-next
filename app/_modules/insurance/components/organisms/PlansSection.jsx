"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { PlaneTakeoff, CalendarDays, Infinity } from "lucide-react";

const plansData = [
    { id: "single", icon: <PlaneTakeoff className="w-8 h-8 text-primary" /> },
    { id: "annual", icon: <CalendarDays className="w-8 h-8 text-primary" /> },
    { id: "biennial", icon: <Infinity className="w-8 h-8 text-primary" /> },
];

export default function PlansSection() {
    const t = useTranslations("InsurancePage.plans");

    return (
        <section className="py-16 max-w-7xl mx-auto px-4">
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
            {/* عرض 3 كروت بجانب بعضها في الشاشات الكبيرة */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plansData.map((plan, index) => (
                    <motion.div
                        key={plan.id}
                        // يبدأ الأنيميشن من الأسفل مع شفافية
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                            duration: 0.5,
                            delay: index * 0.2, // ظهور متسلسل: 0.2 ثم 0.4 ثم 0.6
                            ease: "linear",
                        }}
                        className="relative p-1  border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all group overflow-hidden"
                    >
                        <div className="p-10 flex flex-col items-center text-center">
                            {/* زخرفة خلفية للأيقونة تظهر عند الهوفر */}
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

                            <div className="mb-6 p-5  rounded-2xl  group-hover:text-white transition-colors duration-300">
                                {plan.icon}
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
