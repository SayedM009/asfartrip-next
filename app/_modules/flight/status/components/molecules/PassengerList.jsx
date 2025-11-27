import { motion } from "framer-motion";
import { User } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Passenger List - Shows all passengers
 * @param {Object} props
 * @param {Array} props.passengers - Array of passenger objects
 */
export default function PassengerList({ passengers }) {
    const t = useTranslations("FlightStatus");
    if (!passengers || passengers.length === 0) return null;
    
    return (
        <div className="space-y-4 flex-1 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 py-4 px-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                {t('passengers')} ({passengers.length})
            </h3>
            
            <div className="space-y-3">
                {passengers.map((passenger, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="rounded-xl  flex items-center justify-between text-sm"
                    >
                        {/* Passenger number */}
                        <span className="px-2 py-1 rounded-lg bg-accent/20 text-gray-900 dark:text-white font-semibold text-xs uppercase">
                            #{passenger.travelerNumber || index + 1} {passenger.title}
                        </span>
                        
                        {/* Passenger name */}
                        <span className="font-medium text-gray-900 dark:text-white">
                            {passenger.firstName} {passenger.lastName}
                        </span>
                        
                        {/* Passenger type */}
                        <span className="font-medium text-gray-900 dark:text-white capitalize">
                            {t(passenger.travelerType?.toLowerCase() || 'adult')}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
