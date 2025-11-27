"use client";

import { motion } from "framer-motion";
import { Home, Hotel, Shield, Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * Action Buttons - Next steps buttons for user
 * @param {Object} props
 * @param {string} props.bookingRef - Booking reference
 */
export default function ActionButtons({ bookingRef }) {
    const t = useTranslations("FlightStatus");
    
    const handleDownload = () => {
        // TODO: Implement download e-ticket functionality
        console.log("Download ticket for:", bookingRef);
    };
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center mt-8"
        >
            <Link href="/">
                <button className="px-6 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg">
                    <Home className="w-4 h-4" />
                    {t('go_home')}
                </button>
            </Link>
            
            <Link href="/hotels">
                <button className="px-6 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg">
                    <Hotel className="w-4 h-4" />
                    {t('book_hotel')}
                </button>
            </Link>
            
            <Link href="/insurance">
                <button className="px-6 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg">
                    <Shield className="w-4 h-4" />
                    {t('travel_insurance')}
                </button>
            </Link>
            
            <button 
                onClick={handleDownload}
                className="px-6 py-3 rounded-xl bg-accent text-white hover:bg-accent/90 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
                <Download className="w-4 h-4" />
                {t('download_ticket')}
            </button>
        </motion.div>
    );
}
