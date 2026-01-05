"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
    Zap,
    ShieldCheck,
    MousePointerClick,
    CheckCircle2,
} from "lucide-react";

const featureKeys = [
    { id: "fast", icon: <Zap className="w-6 h-6 text-primary" /> },
    { id: "price", icon: <ShieldCheck className="w-6 h-6 text-primary" /> },
    {
        id: "decide",
        icon: <MousePointerClick className="w-6 h-6 text-primary" />,
    },
    { id: "insure", icon: <CheckCircle2 className="w-6 h-6 text-primary" /> },
];

export default function FeaturesSection() {
    const t = useTranslations("InsurancePage.features");

    return (
        <section className="py-16 max-w-7xl mx-auto px-4">
            {/* العنوان الرئيسي */}
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

            {/* شبكة العناصر */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featureKeys.map((item, index) => (
                    <motion.div
                        key={item.id}
                        // الإعدادات هنا لكل كارت على حدة
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        // تفعيل viewport لكل عنصر بشكل مستقل
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                            duration: 0.6,
                            ease: "easeOut",
                            // هنا نستخدم الـ index لعمل تأخير بسيط إذا ظهر كارتين معاً في نفس السطر
                            delay: (index % 2) * 0.1,
                        }}
                        className="flex flex-col p-8 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 group"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-2  rounded-lg group-hover:bg-primary/10 transition-colors">
                                {item.icon}
                            </div>
                            <h3 className="font-bold text-xl  tracking-wide uppercase">
                                {t(`items.${item.id}.title`)}
                            </h3>
                        </div>

                        <p className="text-muted-foreground leading-relaxed text-md">
                            {t(`items.${item.id}.desc`)}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
