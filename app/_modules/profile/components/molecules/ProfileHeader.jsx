"use client";
import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import useCheckLocal from "@/app/_hooks/useCheckLocal";
import useAuthStore from "@/app/_modules/auth/store/authStore";
import ChevronBasedOnLanguage from "@/app/_components/ui/ChevronBasedOnLanguage";
import ShadcnAvatar from "@/app/_modules/auth/components/molecules/ShadcnAvatar";

export default function Header() {
    const p = useTranslations("Profile");

    const [greeting, setGreeting] = useState(p("welcome_back"));
    const { isRTL } = useCheckLocal();

    const { user } = useAuthStore();
    const { name = "", email = "" } = user;

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting(p("greeding_morning"));
        else if (hour < 18) setGreeting(p("greeding_afternoon"));
        else setGreeting(p("greeding_evening"));
    }, [p]);

    return (
        <>
            {/*  Back Button */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Link
                    href="/"
                    className={`absolute top-5 ${
                        isRTL ? "right-4" : "left-4"
                    } z-30 p-2 rounded-full shadow-md hover:scale-110 transition`}
                >
                    <span className="rotate-180 block">
                        <ChevronBasedOnLanguage size="5" icon="arrow" />
                    </span>
                </Link>
            </motion.div>

            {/*  Header */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="px-4 pt-20 pb-6 flex items-center gap-3"
            >
                <ShadcnAvatar
                    user={user}
                    className={
                        "rounded-full w-16 h-16 shadow-2xl outline-2 outline-gray-300 dark:outline-white border-2 border-transparent flex items-center justify-center"
                    }
                />
                <div>
                    <p className="text-xs text-gray-400 dark:text-gray-400">
                        {greeting}
                    </p>
                    <h1 className="font-semibold text-[17px] leading-tight">
                        {name}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {email}
                    </p>
                </div>
            </motion.div>
        </>
    );
}
