"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function AboutPage() {
    const t = useTranslations("About");

    return (
        <section className="pt-10 pb-20 space-y-20 sm:space-y-32 transition-colors duration-300">
            {/* HERO */}
            <motion.section
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6 mb-20"
            >
                <h1 className="text-2xl md:text-3xl lg:text-4xl tracking-tight text-foreground leading-snug">
                    {t("hero.title")}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed whitespace-pre-line">
                    {t("hero.subtitle")}
                </p>
            </motion.section>

            {/* ABOUT */}
            <motion.section
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
            >
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                    {t("about.title")}
                </h2>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                    {t("about.body")}
                </p>
            </motion.section>

            {/* SERVICES */}
            <motion.section
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-10"
            >
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                    {t("services.title")}
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 md:gap-12">
                    {[
                        { key: "flights", image: "/icons/airplane-m.gif" },
                        { key: "hotels", image: "/icons/bed-m.gif" },
                        { key: "insurance", image: "/icons/insurance-m.gif" },
                        { key: "holidays", image: "/icons/holiday-m.gif" },
                        { key: "activities", image: "/icons/activities-m.gif" },
                        { key: "car_transfer", image: "/icons/car-m.gif" },
                        { key: "car_rental", image: "/icons/car-rent-m.gif" },
                        { key: "esim", image: "/icons/esim-m.gif" },
                    ].map(({ key, image }) => (
                        <div
                            key={key}
                            className="group flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03]"
                        >
                            <div className="relative">
                                <Image
                                    src={image}
                                    alt={t(`services.${key}`)}
                                    width={80}
                                    height={80}
                                    className="mb-3 drop-shadow-sm"
                                    loading="lazy"
                                />

                                {!['flights', 'hotels', 'insurance'].includes(key) && (
                                    <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-semibold rounded-full text-white animate-pulse bg-gradient-to-r from-amber-500 via-pink-500 to-purple-500">
                                        {t("soon")}
                                    </span>
                                )}
                            </div>

                            <h3 className="text-lg font-medium text-foreground mb-1">
                                {t(`services.${key}`)}
                            </h3>
                        </div>
                    ))}
                </div>
            </motion.section>

            {/* VISION & MISSION */}
            <motion.section
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="grid md:grid-cols-2 gap-10"
            >
                <div className="space-y-5">
                    <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                        {t("vision.title")}
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                        {t("vision.content")}
                    </p>
                </div>

                <div className="space-y-5">
                    <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                        {t("mission.title")}
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                        {t("mission.content")}
                    </p>
                </div>
            </motion.section>

            {/* VALUES */}
            <motion.section
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="grid md:grid-cols-2 gap-10"
            >
                <div>
                    <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
                        {t("why.title")}
                    </h2>

                    <ul className="space-y-4 text-muted-foreground">
                        <li className="leading-relaxed">
                            • {t("why.items.0")}
                        </li>
                        <li className="leading-relaxed">
                            • {t("why.items.1")}
                        </li>
                        <li className="leading-relaxed">
                            • {t("why.items.2")}
                        </li>
                        <li className="leading-relaxed">
                            • {t("why.items.3")}
                        </li>
                        <li className="leading-relaxed">
                            • {t("why.items.4")}
                        </li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
                        {t("values.title")}
                    </h2>

                    <ul className="space-y-4 text-muted-foreground">
                        <li className="leading-relaxed">
                            • {t("values.items.0")}
                        </li>
                        <li className="leading-relaxed">
                            • {t("values.items.1")}
                        </li>
                        <li className="leading-relaxed">
                            • {t("values.items.2")}
                        </li>
                        <li className="leading-relaxed">
                            • {t("values.items.3")}
                        </li>
                        <li className="leading-relaxed">
                            • {t("values.items.4")}
                        </li>
                    </ul>
                </div>
            </motion.section>

            {/* WHY CHOOSE US */}
            <motion.section
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            ></motion.section>

            {/* PROMISE */}
            <motion.section
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-5"
            >
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                    {t("promise.title")}
                </h2>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                    {t("promise.body")}
                </p>
            </motion.section>

            {/* B2B */}
            <motion.section
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-5"
            >
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                    {t("b2b.title")}
                </h2>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                    {t("b2b.body")}
                </p>
            </motion.section>

            {/* PARTNERS */}
            <PartnersMarquee />

            {/* CTA */}
            <motion.section
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center space-y-5"
            >
                <h2 className="text-3xl font-semibold text-foreground">
                    {t("cta.title")}
                </h2>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    {t("cta.subtitle")}
                </p>
                <Link
                    href="/contact-us"
                    className="inline-flex items-center justify-center px-8 py-3 bg-foreground text-background font-medium rounded-full hover:opacity-85 transition"
                >
                    {t("cta.button")}
                </Link>
            </motion.section>
        </section>
    );
}

function PartnersMarquee() {
    const t = useTranslations("About.partners");
    const partners = [
        { src: "/parteners/emirates.svg", alt: "Emirates" },
        { src: "/parteners/travelport.svg", alt: "Travelport" },
        { src: "/parteners/sabre.svg", alt: "Sabre" },
        { src: "/parteners/pegasus.png", alt: "Pegasus" },
        { src: "/parteners/air-arabia.svg", alt: "Air Arabia" },
        { src: "/parteners/indigo.png", alt: "IndiGo" },
        { src: "/parteners/air-india.svg", alt: "Air India Express" },
        { src: "/parteners/telr.png", alt: "Telr" },
        { src: "/parteners/xero.svg", alt: "Xero" },
        { src: "/parteners/paytab.png", alt: "PayTabs" },
    ];

    return (
        <motion.section
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
        >
            <h2 className="text-3xl  text-foreground">{t("title")}</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 md:gap-12">
                {partners.map((partner, index) => (
                    <div
                        key={index}
                        className="col-span-1 border border-border bg-card rounded-2xl shadow-sm flex items-center justify-center w-full h-32 p-4"
                    >
                        <Image
                            src={partner.src}
                            alt={partner.alt}
                            width={100}
                            height={100}
                            className="object-contain max-h-full grayscale hover:grayscale-0 transition"
                        />
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
