import { motion } from "framer-motion";
import { useCurrency } from "@/app/_modules/currency/hooks/useCurrency";

/**
 * Price Tag - Displays price with label
 * @param {Object} props
 * @param {string} props.label - Price label
 * @param {number|string} props.amount - Price amount
 * @param {string} props.currency - Currency code
 * @param {boolean} props.highlighted - Whether to highlight (for total)
 */
export default function PriceTag({ label, amount, currency, highlighted = false }) {
    const { formatPrice } = useCurrency();
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`py-2 flex items-center gap-2 justify-between ${
                highlighted ? 'border-t-2 border-accent-500 pt-4 mt-2' : ''
            }`}
        >
            <p className={`text-sm ${highlighted ? 'font-semibold' : ''}`}>{label}</p>
            <div className={`${highlighted ? 'text-2xl' : 'text-xl'} font-bold flex items-center gap-2 ${
                highlighted ? 'text-accent-500' : 'text-gray-900 dark:text-white'
            }`}>
                {formatPrice(amount)}
            </div>
        </motion.div>
    );
}
