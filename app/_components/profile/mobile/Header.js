import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import ChevronBasedOnLanguage from "../../ui/ChevronBasedOnLanguage";
import useAuthStore from "@/app/_store/authStore";

export function Header() {
    const p = useTranslations("Profile");
    const [greeting, setGreeting] = useState(p("welcome_back"));
    const { isRTL } = useCheckLocal();

    const {
        session: {
            fullData: { user },
        },
    } = useAuthStore();

    const { firstname, lastname, email } = user;

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting(p("greeding_morning"));
        else if (hour < 18) setGreeting(p("greeding_afternoon"));
        else setGreeting(p("greeding_evening"));
    }, [p]);

    return (
        <>
            {/* 🔙 Back Button */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Link
                    href="/"
                    className={`absolute top-5 ${
                        isRTL ? "right-4" : "left-4"
                    } z-30 p-2 rounded-full bg-white dark:bg-neutral-800 shadow-md hover:scale-110 transition`}
                >
                    <span className="rotate-180 block">
                        <ChevronBasedOnLanguage size="5" icon="arrow" />
                    </span>
                </Link>
            </motion.div>

            {/* 👤 Header */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="px-4 pt-16 pb-6 border-b border-gray-100 dark:border-neutral-800 flex items-center gap-3"
            >
                <Image
                    src="/avatar.webp"
                    alt="User Avatar"
                    width={65}
                    height={65}
                    className="rounded-full shadow-lg"
                />
                <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        {greeting}
                    </p>
                    <h1 className="font-semibold text-[17px] leading-tight">
                        {firstname} {lastname}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {email}
                    </p>
                </div>
            </motion.div>
        </>
    );
}
