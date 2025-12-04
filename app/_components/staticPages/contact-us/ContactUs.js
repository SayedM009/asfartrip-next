"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";

import {
    MessageCircle,
    Mail,
    MapPin,
    HeadphonesIcon,
} from "lucide-react";
import SocialMedia from "../../SocialMedia";
import { WebsiteConfigContext } from "@/app/_modules/config";
import { use } from "react";

export default function ContactUs() {
    const c = useTranslations("ContactPage");

    const { website } = use(WebsiteConfigContext)

    // =================== CONTACT DATA ===================
    const contactCards = [
        {
            icon: MessageCircle,
            iconColor: "#25D366",
            title: c("cards_whatsapp_title"),
            subtitle: c("cards_whatsapp_subtitle"),
            value: c("cards_whatsapp_value"),
            link: "https://wa.me/+971(4)3409933".replace(/[^0-9]/g, ""),
        },
        {
            icon: Mail,
            iconColor: "#e86b1e",
            title: c("cards_email_title"),
            subtitle: c("cards_email_subtitle"),
            value: c("cards_email_value"),
            link: "mailto:support@asfartrip.com",
        },
        {
            icon: MapPin,
            iconColor: "#e86b1e",
            title: c("cards_office_title"),
            subtitle: c("cards_office_subtitle"),
            value: c("cards_office_value"),
        },
    ];



    // =================== ILLUSTRATION ===================
    function ContactIllustration() {
        return (
            <svg
                className="w-full h-full"
                viewBox="0 0 240 240"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    cx="120"
                    cy="120"
                    r="80"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.15"
                    className="text-gray-900 dark:text-white"
                />

                <g opacity="0.6" className="text-gray-900 dark:text-white">
                    <circle cx="90" cy="100" r="4" fill="currentColor" />
                    <path
                        d="M90 96 L90 100 L90 104"
                        stroke="currentColor"
                        strokeWidth="2"
                    />

                    <circle cx="150" cy="110" r="4" fill="currentColor" />
                    <path
                        d="M150 106 L150 110 L150 114"
                        stroke="currentColor"
                        strokeWidth="2"
                    />

                    <circle cx="120" cy="140" r="4" fill="currentColor" />
                    <path
                        d="M120 136 L120 140 L120 144"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                </g>

                <g className="text-[#e86b1e]">
                    <rect
                        x="140"
                        y="70"
                        width="50"
                        height="35"
                        rx="8"
                        fill="currentColor"
                        opacity="0.2"
                    />
                    <circle
                        cx="155"
                        cy="87"
                        r="2.5"
                        fill="currentColor"
                        opacity="0.6"
                    />
                    <circle
                        cx="165"
                        cy="87"
                        r="2.5"
                        fill="currentColor"
                        opacity="0.6"
                    />
                    <circle
                        cx="175"
                        cy="87"
                        r="2.5"
                        fill="currentColor"
                        opacity="0.6"
                    />
                </g>

                <motion.g
                    initial={{ x: 50, y: 50 }}
                    animate={{ x: 170, y: 80 }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop",
                    }}
                    style={{ willChange: "transform" }}
                    className="text-gray-900 dark:text-white"
                    opacity="0.4"
                >
                    <path d="M 0 0 L 14 -4 L 14 4 Z" fill="currentColor" />
                </motion.g>

                <motion.path
                    d="M 60 60 Q 100 80 140 70 T 180 90"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="4 6"
                    opacity="0.2"
                    className="text-gray-900 dark:text-white"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop",
                    }}
                    style={{ willChange: "transform" }}
                />
            </svg>
        );
    }

    // =================== MAIN PAGE ===================
    return (
        <div className="transition-colors duration-300 mb-20 sm:mb-auto">
            {/* HERO */}
            <header className="relative overflow-hidden bg-gradient-to-br from-orange-50/50 via-white to-background dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-14 lg:py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-full mb-6 shadow-sm">
                            <HeadphonesIcon className="w-4 h-4 text-[#e86b1e]" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                {c("support_badge")}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white mb-4 tracking-tight">
                            {c("hero_title")}
                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                            {c("hero_subtitle")}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="hidden lg:block"
                    >
                        <div className="w-full h-64">
                            <ContactIllustration />
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <section className="sm:py-16 lg:py-24">
                {/* CONTACT CARDS */}
                <section className="mb-16 lg:mb-28">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {contactCards.map((card, index) => {
                            const Icon = card.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.4 + index * 0.1,
                                    }}
                                >
                                    <div
                                        className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 lg:p-10 h-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group cursor-pointer flex flex-col items-center sm:block"
                                        onClick={() =>
                                            card.link &&
                                            window.open(card.link, "_blank")
                                        }
                                    >
                                        <div
                                            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                                            style={{
                                                backgroundColor: `${card.iconColor}15`,
                                            }}
                                        >
                                            <Icon
                                                className="w-8 h-8"
                                                style={{
                                                    color: card.iconColor,
                                                }}
                                            />
                                        </div>

                                        <h3 className="text-2xl text-gray-900 dark:text-white mb-2">
                                            {card.title}
                                        </h3>

                                        <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                                            {card.subtitle}
                                        </p>

                                        <p className="text-lg text-gray-700 dark:text-gray-300 group-hover:text-[#e86b1e] transition-colors duration-300">
                                            {card.value}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* SOCIAL */}
                <section className="mb-16 lg:mb-28 text-center">
                    <h2 className="text-3xl lg:text-5xl text-gray-900 dark:text-white mb-3 tracking-tight">
                        {c("social_title")}
                    </h2>

                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
                        {c("social_subtitle")}
                    </p>

                    <SocialMedia />
                </section>



                {/* MAP */}
                {website?.map_url && (
                    <MapSection c={c} website={website} />
                )}
            </section>
        </div>
    );
}


function MapSection({ c, website }) {
    return (
        <section>
            <h2 className="text-3xl lg:text-5xl text-gray-900 dark:text-white mb-4 tracking-tight">
                {c("map_title")}
            </h2>

            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4280.861641500784!2d55.3021035!3d25.2405206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f61492407cd75%3A0x98af8805b3eedbac!2sAsfar%20Travel%20Agency%20LLC!5e1!3m2!1sar!2sae!4v1763303035713!5m2!1sar!2sae"
                width="100%"
                height="420"
                style={{ border: 0, borderRadius: "20px" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="shadow-sm"
            ></iframe>
        </section>
    );
}