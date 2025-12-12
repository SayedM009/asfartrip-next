"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function TimeoutPopup({
    timeoutMinutes = 10,
    redirectLink = "/",
    subText = "",
    buttonText = "",
}) {
    const [showPopup, setShowPopup] = useState(false);
    const router = useRouter();
    const t = useTranslations("Timeout");

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowPopup(true);
        }, timeoutMinutes * 60 * 1000);

        return () => clearTimeout(timeout);
    }, [timeoutMinutes]);

    const handleRedirect = () => {
        setShowPopup(false);
        router.push(redirectLink);
    };

    if (!showPopup) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-950 rounded-lg px-4 py-4 shadow-2xl w-[90%] max-w-sm text-center flex flex-col items-center border border-gray-200 dark:border-gray-700 transition-all border-dashed">
                <Image
                    src="/icons/alarm.png"
                    alt="session expired"
                    width={60}
                    height={60}
                    className="dark:opacity-90"
                />
                <h3 className="text-primary-900 dark:text-white mt-5 text-xl font-semibold">
                    {t("title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 mb-4 font-medium leading-relaxed">
                    {subText ? subText : t("message")}
                </p>
                <button
                    onClick={handleRedirect}
                    className="bg-accent-500 hover:bg-accent-600 dark:bg-accent-600 dark:hover:bg-accent-500 text-white px-6 py-2.5 rounded-md w-full  transition-colors duration-200 cursor-pointer"
                >
                    {buttonText ? buttonText : t("button")}
                </button>
            </div>
        </div>
    );
}
