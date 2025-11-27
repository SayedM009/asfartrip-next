"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import StatusBadge from "../atoms/StatusBadge";

/**
 * Status Hero - Hero section showing booking status
 * @param {Object} props
 * @param {string} props.status - Status: success, pending, failed
 * @param {string} props.bookingRef - Booking reference
 * @param {string} props.pnr - PNR code
 */
export default function StatusHero({ status, bookingRef, pnr }) {
    const t = useTranslations("FlightStatus");
    
    const config = {
        success: {
            gradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
            icon: CheckCircle2,
            title: t('booking_confirmed'),
            subtitle: t('ticket_issued'),
            iconColor: 'text-green-600 dark:text-green-400',
            borderColor: 'border-green-200 dark:border-green-800',
        },
        pending: {
            gradient: 'from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20',
            icon: Clock,
            title: t('processing_booking'),
            subtitle: t('ticket_pending'),
            iconColor: 'text-amber-600 dark:text-amber-400',
            borderColor: 'border-amber-200 dark:border-amber-800',
        },
        failed: {
            gradient: 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20',
            icon: XCircle,
            title: t('booking_failed'),
            subtitle: t('transaction_failed'),
            iconColor: 'text-red-600 dark:text-red-400',
            borderColor: 'border-red-200 dark:border-red-800',
        },
    };
    
    const { gradient, icon: Icon, title, subtitle, iconColor, borderColor } = config[status] || config.failed;
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`relative p-8 rounded-3xl bg-gradient-to-br ${gradient} border ${borderColor} shadow-xl overflow-hidden flex  sm:block`}
        >
            {/* Background glow - subtle accent */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(232,107,30,0.05),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_30%,rgba(232,107,30,0.1),transparent_70%)]" />
            
            {/* Content */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="flex items-center sm:flex-row sm:items-center gap-2 mb-4 ">
                    <Icon className={`sm:w-16 sm:h-16 w-8 h-8 ${iconColor} flex-shrink-0 text-center`} />
                    <div className="sm:flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-lg sm:text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
                            <StatusBadge status={status} />
                        </div>
                        {/* <p className="text-gray-600 dark:text-gray-300">{subtitle}</p> */}
                    </div>
                </div>
                
                <div className="flex sm:flex-col gap-2 sm:gap-4 text-sm text-gray-600 dark:text-gray-300">
                    {pnr && (
                        <div>
                            <span className="text-gray-500 dark:text-gray-400">{t('pnr')}:</span>{' '}
                            <span className="font-bold text-gray-900 dark:text-white ">{pnr}</span>
                        </div>
                    )}
                    <div>
                        <span className="text-gray-500 dark:text-gray-400">{t('booking_ref')}:</span>{' '}
                        <span className="font-bold text-gray-900 dark:text-white">{bookingRef}</span>
                    </div>
                    
                </div>
            </div>
        </motion.div>
    );
}
